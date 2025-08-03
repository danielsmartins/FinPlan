import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function TransactionActions({ transaction, onEdit, onDelete }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-100">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onEdit(transaction);
        }}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
      >
        <PencilSquareIcon className="w-5 h-5" />
        Editar
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onDelete(transaction.id);
        }}
        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
      >
        <TrashIcon className="w-5 h-5" />
        Deletar
      </a>
    </div>
  );
}

export default TransactionActions;