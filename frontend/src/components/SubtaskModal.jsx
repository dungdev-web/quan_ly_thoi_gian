export default function SubtaskModal({ task, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      <div className="bg-white w-[400px] rounded shadow-lg p-5 relative">
        
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-3">{task.title}</h2>

        {task.subtasks?.length > 0 ? (
          <ul className="list-disc ml-5 text-gray-700 space-y-2">
            {task.subtasks.map((s) => (
              <li key={s.id}>{s.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Không có subtask</p>
        )}

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  );
}
