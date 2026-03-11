import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { subjectAPI, assignmentAPI, submissionAPI } from '../../services/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ subjects: 0, pending: 0, submitted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [subjectsRes, assignmentsRes, submissionsRes] = await Promise.all([
          subjectAPI.getMySubjects(),
          assignmentAPI.getMyAssignments(),
          submissionAPI.getMySubmissions(),
        ]);
        const pending = assignmentsRes.data.filter((a) => !a.submission_id).length;
        setStats({
          subjects: subjectsRes.data.length,
          pending,
          submitted: submissionsRes.data.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#4F46E5" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {user?.name}! 👋</Text>
        <Text style={styles.subtext}>Student Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Enrolled" value={stats.subjects} emoji="📚" color="#EEF2FF" />
        <StatCard label="Pending" value={stats.pending} emoji="📋" color="#FEF9C3" />
        <StatCard label="Submitted" value={stats.submitted} emoji="✅" color="#F0FDF4" />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Subjects')}>
          <Text style={styles.actionText}>📚 View Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Assignments')}>
          <Text style={styles.actionText}>📋 View Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Grades')}>
          <Text style={styles.actionText}>⭐ View Grades</Text>
        </TouchableOpacity>
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
  header: { backgroundColor: '#4F46E5', padding: 24, paddingTop: 40 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtext: { fontSize: 14, color: '#A5B4FC', marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 12, padding: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  quickActions: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  actionButton: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  actionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
});

export default HomeScreen;
