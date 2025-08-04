import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import EmojiPicker from 'emoji-picker-react';

function CategoryPanel({ categories, onAddCategory, onDeleteCategory }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('😀');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory({ name: newCategoryName, icon: newCategoryIcon });
    setNewCategoryName('');
    setNewCategoryIcon('😀');
  };

  const onEmojiClick = (emojiObject) => {
    setNewCategoryIcon(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="md:col-span-1 border-r pr-8">
      <h3 className="font-semibold text-lg mb-4">Categorias</h3>
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-12 h-12 text-2xl flex items-center justify-center border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex-shrink-0"
          >
            {newCategoryIcon}
          </button>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nova categoria"
            className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Add</button>
        </form>
        {showEmojiPicker && (
          <div className="absolute z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
            <span className="flex items-center gap-3">
              <span className="text-xl">{cat.icon || '📁'}</span>
              {cat.name}
            </span>
            <button onClick={() => onDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPanel;
