import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { subjectAPI } from '../../services/api';

const SubjectsScreen = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [tab, setTab] = useState('enrolled');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchData = async () => {
    try {
      const [enrolledRes, allRes] = await Promise.all([
        subjectAPI.getMySubjects(),
        subjectAPI.getAllSubjects(),
      ]);
      const enrolledIds = new Set(enrolledRes.data.map((s) => s.id));
      setEnrolled(enrolledRes.data);
      setAvailable(allRes.data.filter((s) => !enrolledIds.has(s.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEnroll = async (id) => {
    setActionId(id);
    try { await subjectAPI.enroll(id); await fetchData(); } catch (err) { console.error(err); }
    setActionId(null);
  };

  const handleUnenroll = async (id) => {
    setActionId(id);
    try { await subjectAPI.unenroll(id); await fetchData(); } catch (err) { console.error(err); }
    setActionId(null);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#4F46E5" />;

  const subjects = tab === 'enrolled' ? enrolled : available;

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'enrolled' && styles.activeTab]}
          onPress={() => setTab('enrolled')}
        >
          <Text style={[styles.tabText, tab === 'enrolled' && styles.activeTabText]}>
            Enrolled ({enrolled.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'available' && styles.activeTab]}
          onPress={() => setTab('available')}
        >
          <Text style={[styles.tabText, tab === 'available' && styles.activeTabText]}>
            Available ({available.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>{tab === 'enrolled' ? 'Not enrolled in any subjects' : 'No available subjects'}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.teacher}>👤 {item.teacher_name}</Text>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            <TouchableOpacity
              style={[styles.actionBtn, tab === 'enrolled' ? styles.unenrollBtn : styles.enrollBtn]}
              onPress={() => tab === 'enrolled' ? handleUnenroll(item.id) : handleEnroll(item.id)}
              disabled={actionId === item.id}
            >
              <Text style={styles.actionBtnText}>
                {actionId === item.id ? '...' : tab === 'enrolled' ? 'Unenroll' : 'Enroll'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4F46E5' },
  tabText: { color: '#6B7280', fontWeight: '500' },
  activeTabText: { color: '#4F46E5' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 18, fontWeight: '600', color: '#111827' },
  teacher: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  desc: { fontSize: 13, color: '#9CA3AF', marginTop: 6 },
  actionBtn: { marginTop: 12, borderRadius: 8, padding: 10, alignItems: 'center' },
  enrollBtn: { backgroundColor: '#4F46E5' },
  unenrollBtn: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA' },
  actionBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 16 },
});

export default SubjectsScreen;
