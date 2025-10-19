'use client';

import React from 'react';

export default function WebsiteViewer({ url }: { url: string }) {
    return (
        <div className="w-full bg-gray flex justify-center items-center pb-4">
            <iframe
                src={url}
                title="External Website"
                className="w-200 h-[400px] border-2 border-gray-300 rounded-lg shadow-lg"
            />
        </div>
    );
}
