"use client"
import Loader from '@/components/Loader';
import { getClientDocumentRequest } from '@/lib/http/client';
import React, { useEffect, useState } from 'react'

const FileIcon = () => (
    <span style={{ marginRight: 8 }}>📄</span>
);

const page = ({ params }) => {
    const { id } = params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchDocuemnt = async () => {
        setLoading(true)
        try {
            const res = await getClientDocumentRequest(id);
            setData(res.data.data);
        } catch (error) {
            console.log("Getting An Error During Getting Document:", error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuemnt()
    }, [])

    if (loading) {
        return <>
            <div className=" h-screen bg-primary m-2 rounded-md flex items-center justify-center">
                <Loader />
            </div>
        </>
    }

    return (
        <main className="flex-1 overflow-auto p-8 bg-secondary m-2 rounded-md">
            <div style={{ padding: 24 }} className='text-white'>
                <h2>Client Files</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: 8 }}>File</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? data.map((file, idx) => (
                            <tr
                                key={idx}
                                style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onClick={() => file.file_url && window.open(file.file_url, '_blank')}
                            >
                                <td style={{ padding: 8 }}><FileIcon /></td>
                                <td style={{ padding: 8 }}>{file.name || 'Untitled'}</td>
                                <td style={{ padding: 8 }}>{file.size ? `${(file.size / 1024).toFixed(1)} KB` : '-'}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} style={{ padding: 8, textAlign: 'center' }}>No files found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default page