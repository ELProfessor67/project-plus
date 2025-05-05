'use client'
import React, { useState, useRef, useEffect } from 'react'

const Page = () => {
  const [items, setItems] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const containerRef = useRef(null);

  const createFolder = (parentId = null) => {
    const name = prompt('Enter folder name:');
    if (name) {
      setItems(prev => [
        ...prev,
        { id: Date.now(), name, type: 'folder', parentId }
      ]);
    }
    setContextMenu(null);
  };

  const uploadFile = (parentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        setItems(prev => [
          ...prev,
          { id: Date.now(), name: file.name, type: 'file', parentId }
        ]);
      }
    };
    input.click();
    setContextMenu(null);
  };

  const deleteItem = (id) => {
    const toDelete = [id];
    const collectChildren = (pid) => {
      items.forEach(i => {
        if (i.parentId === pid) {
          toDelete.push(i.id);
          if (i.type === 'folder') collectChildren(i.id);
        }
      });
    };
    collectChildren(id);
    setItems(prev => prev.filter(i => !toDelete.includes(i.id)));
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

  const renderTree = (parentId = null) => {
    return items
      .filter(i => i.parentId === parentId)
      .map(i => (
        <div key={i.id} className="ml-4 mt-2" onContextMenu={(e) => handleRightClick(e, i)}>
          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
            onClick={() => {
              if (i.type === 'folder') {
                setExpandedFolders(prev => ({
                  ...prev,
                  [i.id]: !prev[i.id]
                }));
              } else {
                setContextMenu({
                  x: window.event.pageX,
                  y: window.event.pageY,
                  item: i
                });
              }
            }}
          >
            {i.type === 'folder' ? (
              <span>📁 {i.name}</span>
            ) : (
              <span>📄 {i.name}</span>
            )}
          </div>
          {i.type === 'folder' && expandedFolders[i.id] && (
            <div className="ml-4 border-l border-gray-300 pl-2">
              {renderTree(i.id)}
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

  const handleFileAction = (action, file) => {
    alert(`${action} for file: ${file.name}`);
    setContextMenu(null);
  };

  return (
    <main className="flex-1 overflow-auto p-4 bg-white m-2 rounded-md">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">Document Manager</h1>
      </div>

      <div
        ref={containerRef}
        className="bg-gray-100 rounded-md h-[80vh] overflow-y-auto p-4 relative"
        id="container"
        onContextMenu={(e) => handleRightClick(e, null)}
      >
        {renderTree()}

        {contextMenu && (
          <div
            className="absolute z-50 bg-white border border-gray-300 shadow-md rounded p-2 text-sm space-y-2"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {!contextMenu.item && (
              <button onClick={() => createFolder(null)} className="block w-full text-left hover:bg-gray-100 px-2 py-1">📁 Create Folder</button>
            )}

            {contextMenu.item?.type === 'folder' && (
              <>
                <button onClick={() => createFolder(contextMenu.item.id)} className="block w-full text-left hover:bg-gray-100 px-2 py-1">📁 New Subfolder</button>
                <button onClick={() => uploadFile(contextMenu.item.id)} className="block w-full text-left hover:bg-gray-100 px-2 py-1">📄 Upload File</button>
                <button onClick={() => deleteItem(contextMenu.item.id)} className="block w-full text-left hover:bg-gray-100 px-2 py-1 text-red-500">🗑️ Delete Folder</button>
              </>
            )}

            {contextMenu.item?.type === 'file' && (
              <>
                <button onClick={() => handleFileAction('Edit File', contextMenu.item)} className="block w-full text-left hover:bg-gray-100 px-2 py-1">✏️ Edit File</button>
                <button onClick={() => handleFileAction('Send to Lawyer', contextMenu.item)} className="block w-full text-left hover:bg-gray-100 px-2 py-1">📨 Send to Lawyer</button>
                <button onClick={() => handleFileAction('Send to Client', contextMenu.item)} className="block w-full text-left hover:bg-gray-100 px-2 py-1">📩 Send to Client</button>
                <button onClick={() => deleteItem(contextMenu.item.id)} className="block w-full text-left hover:bg-gray-100 px-2 py-1 text-red-500">🗑️ Delete File</button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
