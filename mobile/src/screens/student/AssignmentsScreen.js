import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { assignmentAPI, submissionAPI } from '../../services/api';

const AssignmentsScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchAssignments(); }, []);

  const handleSubmit = async (assignmentId) => {
    Alert.alert(
      'Submit Assignment',
      'Submit this assignment without a file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('assignment_id', assignmentId.toString());
              await submissionAPI.submit(formData);
              Alert.alert('Success', 'Assignment submitted!');
              await fetchAssignments();
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Submission failed');
            }
          },
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#4F46E5" />;

  const pending = assignments.filter((a) => !a.submission_id);
  const submitted = assignments.filter((a) => a.submission_id);

  return (
    <FlatList
      style={{ backgroundColor: '#F9FAFB' }}
      contentContainerStyle={styles.list}
      data={[
        { type: 'header', key: 'pending-header', text: `Pending (${pending.length})` },
        ...pending.map((a) => ({ type: 'assignment', ...a, isPending: true })),
        { type: 'header', key: 'submitted-header', text: `Submitted (${submitted.length})` },
        ...submitted.map((a) => ({ type: 'assignment', ...a, isPending: false })),
      ]}
      keyExtractor={(item) => item.type === 'header' ? item.key : item.id.toString()}
      ListEmptyComponent={<Text style={styles.empty}>No assignments yet</Text>}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return <Text style={styles.sectionHeader}>{item.text}</Text>;
        }
        return (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subject}>{item.subject_title}</Text>
                {item.due_date && (
                  <Text style={styles.due}>📅 Due: {new Date(item.due_date).toLocaleDateString()}</Text>
                )}
              </View>
              <View>
                {item.isPending ? (
                  <>
                    <View style={styles.badgePending}>
                      <Text style={styles.badgePendingText}>Pending</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={() => handleSubmit(item.id)}
                    >
                      <Text style={styles.submitBtnText}>Submit</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.badgeSubmitted}>
                      <Text style={styles.badgeSubmittedText}>Submitted</Text>
                    </View>
                    {item.grade !== null && (
                      <Text style={styles.grade}>Grade: {item.grade}</Text>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, gap: 8 },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: '#374151', marginVertical: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  subject: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  due: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  badgePending: { backgroundColor: '#FEF9C3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgePendingText: { fontSize: 12, color: '#CA8A04', fontWeight: '500' },
  badgeSubmitted: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeSubmittedText: { fontSize: 12, color: '#16A34A', fontWeight: '500' },
  submitBtn: { marginTop: 8, backgroundColor: '#4F46E5', borderRadius: 8, padding: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  grade: { fontSize: 13, color: '#4F46E5', fontWeight: '600', marginTop: 4, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 16 },
});

export default AssignmentsScreen;
