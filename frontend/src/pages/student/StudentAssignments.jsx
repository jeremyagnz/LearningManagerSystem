import { useState, useEffect } from 'react';
import { assignmentAPI, submissionAPI } from '../../services/api';
import { FiCalendar, FiUpload, FiCheckCircle, FiClock, FiDownload } from 'react-icons/fi';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAssignments = async () => {
    try {
      const res = await assignmentAPI.getMyAssignments();
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('assignment_id', selectedAssignment.id);
      if (file) formData.append('file', file);
      await submissionAPI.submit(formData);
      setMessage('Assignment submitted successfully!');
      setSelectedAssignment(null);
      setFile(null);
      await fetchAssignments();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const pending = assignments.filter((a) => !a.submission_id);
  const submitted = assignments.filter((a) => a.submission_id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Assignments</h1>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-2">{selectedAssignment.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{selectedAssignment.description}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Pending ({pending.length})</h2>
          {pending.length === 0 ? (
            <p className="text-gray-400 text-sm">No pending assignments</p>
          ) : (
            <div className="space-y-3">
              {pending.map((a) => (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  onSubmit={() => setSelectedAssignment(a)}
                  isPending
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Submitted ({submitted.length})</h2>
          {submitted.length === 0 ? (
            <p className="text-gray-400 text-sm">No submitted assignments</p>
          ) : (
            <div className="space-y-3">
              {submitted.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const AssignmentCard = ({ assignment: a, onSubmit, isPending }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-gray-900">{a.title}</h3>
      <p className="text-sm text-gray-500">{a.subject_title}</p>
      {a.due_date && (
        <span className="flex items-center text-xs text-gray-400 mt-1 space-x-1">
          <FiCalendar className="h-3 w-3" />
          <span>Due: {new Date(a.due_date).toLocaleString()}</span>
        </span>
      )}
      {a.assignment_file_url && (
        <a href={a.assignment_file_url} target="_blank" rel="noopener noreferrer"
          className="flex items-center space-x-1 text-xs text-indigo-600 hover:underline mt-1">
          <FiDownload className="h-3 w-3" /><span>Download Attachment</span>
        </a>
      )}
    </div>
    <div className="flex flex-col items-end space-y-2">
      {isPending ? (
        <>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center space-x-1">
            <FiClock className="h-3 w-3" />
            <span>Pending</span>
          </span>
          <button
            onClick={onSubmit}
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            <FiUpload className="h-4 w-4" />
            <span>Submit</span>
          </button>
        </>
      ) : (
        <>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center space-x-1">
            <FiCheckCircle className="h-3 w-3" />
            <span>Submitted</span>
          </span>
          {a.grade !== null && (
            <span className="text-xs font-semibold text-indigo-600">Grade: {a.grade}</span>
          )}
        </>
      )}
    </div>
  </div>
);

export default StudentAssignments;
