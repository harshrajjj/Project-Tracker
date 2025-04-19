import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axiosConfig';
import AuthContext from '../context/AuthContext';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchTaskAndComments = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        // Fetch task details
        const taskRes = await axios.get(`/tasks/${id}`);
        setTask(taskRes.data.data);

        // Fetch comments for this task
        const commentsRes = await axios.get(`/tasks/${id}/comments`);
        setComments(commentsRes.data.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching task details:', err);
        toast.error('Failed to fetch task details');
        setLoading(false);
        navigate('/dashboard');
      }
    };

    if (!authLoading) {
      fetchTaskAndComments();
    }
  }, [id, navigate, isAuthenticated, authLoading]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const res = await axios.post('/comments', {
        text: newComment,
        task: id
      });

      setComments([res.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(`/tasks/${id}`, {
        status: newStatus
      });

      setTask(res.data.data);
      toast.success('Task status updated');
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.text);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleEditComment = async (e) => {
    e.preventDefault();

    if (!editCommentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const res = await axios.put(`/comments/${editingComment}`, {
        text: editCommentText
      });

      // Update comment in state
      setComments(comments.map(comment =>
        comment._id === editingComment ? res.data.data : comment
      ));

      setEditingComment(null);
      setEditCommentText('');
      toast.success('Comment updated successfully');
    } catch (err) {
      console.error('Error updating comment:', err);
      toast.error(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const confirmDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/comments/${commentToDelete._id}`);

      // Remove comment from state
      setComments(comments.filter(comment => comment._id !== commentToDelete._id));

      setShowDeleteConfirm(false);
      setCommentToDelete(null);
      toast.success('Comment deleted successfully');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (loading || !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
              <p className="text-gray-600 mb-4">{task.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600">
                <strong>Project:</strong> {task.project?.name || 'Unknown Project'}
              </p>
              <p className="text-gray-600">
                <strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <strong className="text-gray-600 mr-2">Status:</strong>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-sm border rounded py-1 px-2 ${
                    task.status === 'Pending' ? 'bg-gray-100' :
                    task.status === 'In Progress' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}
                  disabled={task.assignedTo?._id !== user?.id && user?.role !== 'admin'}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>

          <form onSubmit={handleAddComment} className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                Add a Comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Write your comment here..."
                rows="3"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Comment
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b pb-4">
                  {editingComment === comment._id ? (
                    <form onSubmit={handleEditComment}>
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        rows="3"
                        required
                      ></textarea>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditComment}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-800">{comment.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          By {comment.user?.name || 'Unknown User'} on {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {(user?.id === comment.user?._id || user?.role === 'admin') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditComment(comment)}
                            className="text-yellow-500 hover:text-yellow-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteComment(comment)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Delete Confirmation Modal */}
      {showDeleteConfirm && commentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Comment</h2>
            <p className="mb-6">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCommentToDelete(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
