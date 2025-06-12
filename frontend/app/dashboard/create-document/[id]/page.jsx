'use client'
import React, { useState, useRef, useEffect } from 'react'
import { createFolderRequest, createFileRequest, getFilesRequest, sendToLawyerRequest } from '@/lib/http/project'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';

const Page = () => {
  const [items, setItems] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const response = await getFilesRequest();
      if (response.data.success) {
        setItems(response.data.folders);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch files');
    }finally{
      setIsLoading(false)
    }
  };

  const createFolder = async (parentId = null) => {
    const name = prompt('Enter folder name:');
    if (name) {
      try {
        setIsLoading(true);
        const response = await createFolderRequest({
          name,
          parent_id: parentId,
          project_id: window.location.pathname.split('/').pop()
        });
        if (response.data.success) {
          toast.success('Folder created successfully');
          fetchFiles(); // Refresh the file tree
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to create folder');
      } finally {
        setIsLoading(false);
      }
    }
    setContextMenu(null);
  };

  const uploadFile = async (parentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder_id', parentId);
          formData.append('project_id', window.location.pathname.split('/').pop());

          const response = await createFileRequest(formData);
          if (response.data.success) {
            toast.success('File uploaded successfully');
            fetchFiles(); // Refresh the file tree
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Failed to upload file');
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
    setContextMenu(null);
  };

  const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        setIsLoading(true);
        // TODO: Implement delete API endpoint
        toast.success('Item deleted successfully');
        fetchFiles(); // Refresh the file tree
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to delete item');
      } finally {
        setIsLoading(false);
      }
    }
    setContextMenu(null);
  };

  const handleRightClick = (e, item = null) => {
    e.stopPropagation();
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      item
    });
  };


  const handleFileAction = async (file) => {
    try {
      setIsLoading(true);
      const project_id = window.location.pathname.split('/').pop();
  
      const description = window.prompt("Description");
      const formData = new FormData();
      formData.append("description", description);
      formData.append("project_id", project_id); // if needed by backend
  
      // Fetch file data from the file.path (which is a URL)
      console.log(file.path,"file.path")
      const fileResponse = await fetch(file.path);
      const fileData = await fileResponse.arrayBuffer(); // or .blob()
      const blob = new Blob([fileData], { type: 'application/pdf' });
  
      formData.append("file", blob, file.name);
  
      const response = await sendToLawyerRequest(formData);
  
      if (response.data.success) {
        toast.success(response.data.message);
        fetchFiles(); // Refresh the file tree
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
      setContextMenu(null);
    }
  };

  const handleEditSend = async (file) => {
    router.push(`/dashboard/edit-file/${file.file_id}?file=${file.path}`)
  };

  // Fixed renderTree function to handle nested structure
  const renderTree = (folders = items, level = 0) => {
    return folders.map(folder => (
      <div key={folder.folder_id} className={`${level > 0 ? 'ml-4' : ''} mt-2`}>
        {/* Render folder */}
        <div
          className="flex items-center space-x-2 cursor-pointer hover:bg-primary/10 p-1 rounded"
          onContextMenu={(e) => handleRightClick(e, folder)}
          onClick={() => {
            setExpandedFolders(prev => ({
              ...prev,
              [folder.folder_id]: !prev[folder.folder_id]
            }));
          }}
        >
          <span>📁 {folder.name}</span>
        </div>

        {/* Render expanded content */}
        {expandedFolders[folder.folder_id] && (
          <div className="ml-4 border-l border-gray-300 pl-2">
            {/* Render files in this folder */}
            {folder.files && folder.files.map(file => (
              <div 
                key={file.file_id} 
                className="ml-4 mt-2"
                onContextMenu={(e) => handleRightClick(e, file)}
              >
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-primary/10 p-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenu({
                      x: e.pageX,
                      y: e.pageY,
                      item: file
                    });
                  }}
                >
                  <span>📄 {file.name}</span>
                </div>
              </div>
            ))}

            {/* Render subfolders recursively */}
            {folder.subfolders && folder.subfolders.length > 0 && 
              renderTree(folder.subfolders, level + 1)
            }
          </div>
        )}
      </div>
    ));
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  return (
    <main className="flex-1 overflow-auto p-4 bg-primary min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Document Manager</h1>
      </div>

      <div
        ref={containerRef}
        className="bg-white rounded-lg h-[80vh] overflow-y-auto p-6 relative shadow-lg"
        id="container"
        onContextMenu={(e) => handleRightClick(e, null)}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {renderTree()}

        {contextMenu && (
          <div
            className="absolute z-50 bg-white border border-gray-200 shadow-xl rounded-lg p-2 text-sm space-y-2"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {!contextMenu.item && (
              <button onClick={() => createFolder(null)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-gray-700">📁 Create Folder</button>
            )}

            {contextMenu.item?.file_type == "FOLDER" && (
              <>
                <button onClick={() => createFolder(contextMenu.item.folder_id)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-gray-700">📁 New Subfolder</button>
                <button onClick={() => uploadFile(contextMenu.item.folder_id)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-gray-700">📄 Upload File</button>
                <button onClick={() => deleteItem(contextMenu.item.folder_id)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-red-500">🗑️ Delete Folder</button>
              </>
            )}

            {contextMenu.item?.file_type == "FILE" && (
              <>
                <button onClick={() => handleEditSend(contextMenu.item)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-gray-700">✏️ Edit File </button>
                <button onClick={() => handleFileAction(contextMenu.item)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-gray-700">📨 Send to Lawyer</button>
                <button onClick={() => deleteItem(contextMenu.item.file_id)} className="block w-full text-left hover:bg-primary/10 px-3 py-2 rounded-md transition-colors text-red-500">🗑️ Delete File</button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;