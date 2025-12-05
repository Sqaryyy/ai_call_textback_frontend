import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  content?: string;
}

interface DocumentsTabProps {
  documents: Document[];
  onCreateDocument: (doc: {
    title: string;
    doc_type: string;
    content: string;
  }) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
}

export default function DocumentsTab({
  documents,
  onCreateDocument,
  onDeleteDocument,
}: DocumentsTabProps) {
  const [newDocument, setNewDocument] = useState({
    title: "",
    doc_type: "note",
    content: "",
  });

  const handleCreate = async () => {
    if (!newDocument.title.trim() || !newDocument.content.trim()) return;
    await onCreateDocument(newDocument);
    setNewDocument({ title: "", doc_type: "note", content: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Document Form */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Add New Document</h3>
          <div className="space-y-3">
            <Input
              value={newDocument.title}
              onChange={(e) =>
                setNewDocument({ ...newDocument, title: e.target.value })
              }
              placeholder="Document Title"
            />
            <select
              value={newDocument.doc_type}
              onChange={(e) =>
                setNewDocument({ ...newDocument, doc_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="note">Note</option>
              <option value="policy">Policy</option>
              <option value="faq">FAQ</option>
              <option value="guide">Guide</option>
              <option value="pdf">PDF</option>
              <option value="general">General</option>
            </select>
            <textarea
              value={newDocument.content}
              onChange={(e) =>
                setNewDocument({ ...newDocument, content: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document Content"
            />
            <Button
              onClick={handleCreate}
              disabled={
                !newDocument.title.trim() || !newDocument.content.trim()
              }
              className="gap-2 w-full"
            >
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Type: {doc.type}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteDocument(doc.id)}
                  className="text-red-600 hover:text-red-700 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No documents added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
