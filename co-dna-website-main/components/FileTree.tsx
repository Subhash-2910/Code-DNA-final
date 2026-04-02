'use client';
import { CaretRight, CaretDown, FileCode, FolderSimple, FolderSimplePlus } from '@phosphor-icons/react';
import { useState } from 'react';

export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle | null;
  children?: FileNode[];
  relativePath: string;
  content?: string;
}

interface FileTreeProps {
  node: FileNode;
  activePath: string;
  onFileSelect: (node: FileNode) => void;
  level?: number;
}

export default function FileTree({ node, activePath, onFileSelect, level = 0 }: FileTreeProps) {
  const [isOpen, setIsOpen] = useState(level === 0); // Root is open by default

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.kind === 'directory') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  const isSelected = activePath === node.relativePath;

  return (
    <div style={{ marginLeft: level > 0 ? 20 : 0, fontFamily: 'Figtree, sans-serif' }}>
      <div 
        className={`tree-node ${isSelected ? 'active' : ''}`}
        onClick={handleToggle}
      >
        {node.kind === 'directory' ? (
          <>
            {isOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
            <FolderSimple size={18} weight="fill" color="#8b949e" />
          </>
        ) : (
          <>
            <div style={{ width: 14 }}></div>
            <FileCode size={18} weight="fill" color="#d8b4fe" />
          </>
        )}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
      </div>

      {node.kind === 'directory' && isOpen && node.children && (
        <div className="tree-children">
          {node.children
            .sort((a, b) => {
              if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) => (
              <FileTree 
                key={child.relativePath} 
                node={child} 
                activePath={activePath} 
                onFileSelect={onFileSelect} 
                level={level + 1} 
              />
            ))}
        </div>
      )}
    </div>
  );
}
