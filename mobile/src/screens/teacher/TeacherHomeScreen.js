import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { subjectAPI } from '../../services/api';

const TeacherHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectAPI.getMySubjects()
      .then((res) => setSubjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#4F46E5" />;

  const totalStudents = subjects.reduce((sum, s) => sum + parseInt(s.student_count || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.name}! 👩‍🏫</Text>
        <Text style={styles.subtext}>Teacher Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Subjects" value={subjects.length} emoji="📚" color="#EEF2FF" />
        <StatCard label="Students" value={totalStudents} emoji="👥" color="#F0FDF4" />
      </View>

      <View style={styles.actions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Subjects')}>
          <Text style={styles.actionText}>📚 Manage Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Assignments')}>
          <Text style={styles.actionText}>📋 View Assignments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subjectsList}>
        <Text style={styles.sectionTitle}>My Subjects</Text>
        {subjects.length === 0 ? (
          <Text style={styles.empty}>No subjects yet</Text>
        ) : (
          subjects.map((s) => (
            <View key={s.id} style={styles.subjectCard}>
              <Text style={styles.subjectTitle}>{s.title}</Text>
              <Text style={styles.studentCount}>👥 {s.student_count} students</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value, emoji, color }) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#7C3AED', padding: 24, paddingTop: 40 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtext: { fontSize: 14, color: '#C4B5FD', marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 12, padding: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  actions: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  actionButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  actionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  subjectsList: { paddingHorizontal: 16, paddingBottom: 32 },
  subjectCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  subjectTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  studentCount: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 20, fontSize: 14 },
});

export default TeacherHomeScreen;
