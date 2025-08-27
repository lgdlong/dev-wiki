import type { Metadata } from 'next';
import EditTutorialClient from '@/components/tutorials/edit-tutorial-client';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Edit Tutorial' };

export default function EditTutorialPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const nId = Number(id);
    if (!Number.isFinite(nId) || nId <= 0) notFound();

    return (
        <div className="mx-auto w-full max-w-10xl p-4 sm:p-6 md:p-8">
            <h1 className="mb-4 text-2xl font-semibold tracking-tight">Edit Tutorial</h1>
            <EditTutorialClient id={nId} />
        </div>
    );
}
}