"use client"
import React, { useRef, useEffect, use, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { uploadSignRequest } from '@/lib/http/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';
import { sendToLawyerRequest, updateFileRequest } from '@/lib/http/project';



const page = ({ params, searchParams }) => {
    const { id } = use(params);
    const { file, type } = use(searchParams);
    const viewerRef = useRef(null);
    const instanceRef = useRef(null);
    const alreadyRef = useRef(false);
    const [loading,setLoading] = useState(false);


    useEffect(() => {

        if (alreadyRef.current == false) {
            alreadyRef.current = true
            WebViewer(
                {
                    path: '/lib', // Public path to WebViewer assets
                    initialDoc: file,
                },
                viewerRef.current,
            ).then((instance) => {
                instanceRef.current = instance;
                console.log('WebViewer initialized');
            });
        }
    }, []);


    const handleSaveAndUpload = async () => {
        const instance = instanceRef.current;
        if (!instance) return;
      
        const docViewer = instance.Core.documentViewer;
        const annotManager = instance.Core.annotationManager;
        const doc = docViewer.getDocument();
      
        try {
          // Export all annotations (text, signature, etc.)
          const xfdfString = await annotManager.exportAnnotations();
      
          const fileData = await doc.getFileData({
            xfdfString, 
          });
      
          const blob = new Blob([fileData], { type: 'application/pdf' });
          const formData = new FormData();
          formData.append('file', blob, 'edited-document.pdf');
          formData.append('file_id', id);
      
          setLoading(true);
          const res = await updateFileRequest(formData);
          toast.success(res.data.message);
        } catch (error) {
          toast.error(error?.response?.data?.message || error.message);
        } finally {
          setLoading(false);
        }
      };


    
    const HandleSendToLawyer = async () => {
        const instance = instanceRef.current;
        if (!instance) return;
      
        const docViewer = instance.Core.documentViewer;
        const annotManager = instance.Core.annotationManager;
        const doc = docViewer.getDocument();
      
        try {
          // Export all annotations (text, signature, etc.)
          const xfdfString = await annotManager.exportAnnotations();
      
          const fileData = await doc.getFileData({
            xfdfString, 
          });
      
          const blob = new Blob([fileData], { type: 'application/pdf' });
          const formData = new FormData();
          formData.append('file', blob, 'edited-document.pdf');
          const description = window.prompt("Description");
          formData.append('description', description);
      
          setLoading(true);
          const res = await sendToLawyerRequest(formData);
          toast.success(res.data.message);
        } catch (error) {
          toast.error(error?.response?.data?.message || error.message);
        } finally {
          setLoading(false);
        }
    };
    

      const handleBoth = async () => {
        HandleSendToLawyer()
        handleSaveAndUpload()
      };
      


    return (
        <main className="flex-1 overflow-auto p-1 bg-white m-2 rounded-md ">
            <div ref={viewerRef} style={{ height: '83vh' }} />
            <div className='flex items-center justify-center p-2 w-full gap-4'>
                <Button className={`bg-blue-500 text-white hover:bg-blue-600`} disabled={loading} isLoading={loading} onClick={handleSaveAndUpload}>Save</Button>
                <Button className={`bg-blue-500 text-white hover:bg-blue-600`} disabled={loading} isLoading={loading} onClick={HandleSendToLawyer}>Send To Lawyer</Button>
                <Button className={`bg-blue-500 text-white hover:bg-blue-600`} disabled={loading} isLoading={loading} onClick={handleBoth}>Send To Lawyer And Save</Button>
            </div>
        </main>
    )
}

export default page