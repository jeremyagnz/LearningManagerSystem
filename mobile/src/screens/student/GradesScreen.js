import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { submissionAPI } from '../../services/api';

const GRADE_THRESHOLDS = { passing: 70, acceptable: 50 };

const GradesScreen = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionAPI.getMySubmissions()
      .then((res) => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#4F46E5" />;

  const graded = submissions.filter((s) => s.grade !== null);
  const avg = graded.length > 0
    ? (graded.reduce((sum, s) => sum + parseFloat(s.grade), 0) / graded.length).toFixed(1)
    : null;

  return (
    <View style={styles.container}>
      {avg && (
        <View style={styles.avgCard}>
          <Text style={styles.avgLabel}>Average Grade</Text>
          <Text style={styles.avgValue}>{avg}</Text>
        </View>
      )}
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No submissions yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.assignmentTitle}>{item.assignment_title}</Text>
                <Text style={styles.subjectTitle}>{item.subject_title}</Text>
              </View>
              <View style={styles.gradeContainer}>
                {item.grade !== null ? (
                  <Text style={[
                    styles.grade,
                    item.grade >= GRADE_THRESHOLDS.passing ? styles.gradeGood : item.grade >= GRADE_THRESHOLDS.acceptable ? styles.gradeOk : styles.gradeBad
                  ]}>
                    {item.grade}
                  </Text>
                ) : (
                  <Text style={styles.gradePending}>Pending</Text>
                )}
              </View>
            </View>
            {item.feedback && (
              <Text style={styles.feedback}>💬 {item.feedback}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  avgCard: { backgroundColor: '#4F46E5', padding: 24, alignItems: 'center' },
  avgLabel: { color: '#A5B4FC', fontSize: 14 },
  avgValue: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row', alignItems: 'center' },
  assignmentTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  subjectTitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  gradeContainer: { minWidth: 50, alignItems: 'center' },
  grade: { fontSize: 24, fontWeight: 'bold' },
  gradeGood: { color: '#16A34A' },
  gradeOk: { color: '#D97706' },
  gradeBad: { color: '#DC2626' },
  gradePending: { color: '#9CA3AF', fontSize: 12 },
  feedback: { fontSize: 13, color: '#6B7280', marginTop: 8, fontStyle: 'italic' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 16 },
});

export default GradesScreen;
