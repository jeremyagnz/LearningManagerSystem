import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Modal, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { subjectAPI, assignmentAPI } from '../../services/api';

const TeacherAssignmentsScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', due_date: '' });
  const [saving, setSaving] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getMySubjects();
      setSubjects(res.data);
      if (res.data.length > 0) setSelectedSubject(res.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchAssignments = async (subject) => {
    if (!subject) return;
    setAssignmentsLoading(true);
    try {
      const res = await assignmentAPI.getBySubject(subject.id);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);
  useEffect(() => { fetchAssignments(selectedSubject); }, [selectedSubject]);

  const handleCreate = async () => {
    if (!form.title) return Alert.alert('Error', 'Title is required');
    if (!selectedSubject) return Alert.alert('Error', 'Please select a subject first');
    setSaving(true);
    try {
      await assignmentAPI.create({
        subject_id: selectedSubject.id,
        title: form.title,
        description: form.description || undefined,
        due_date: form.due_date || undefined,
      });
      setModalVisible(false);
      setForm({ title: '', description: '', due_date: '' });
      await fetchAssignments(selectedSubject);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Assignment', 'Are you sure? This will permanently delete this assignment and all its submissions. This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await assignmentAPI.delete(id);
            await fetchAssignments(selectedSubject);
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete assignment');
          }
        },
      },
    ]);
  };

  if (subjectsLoading) return <ActivityIndicator style={{ flex: 1 }} color="#7C3AED" />;

  if (subjects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Subjects Yet</Text>
        <Text style={styles.emptySubtext}>Create a subject first to manage assignments.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Subject selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectSelector}
      >
        {subjects.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.subjectChip,
              selectedSubject?.id === s.id && styles.subjectChipActive,
            ]}
            onPress={() => setSelectedSubject(s)}
          >
            <Text style={[
              styles.subjectChipText,
              selectedSubject?.id === s.id && styles.subjectChipTextActive,
            ]}>
              {s.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {assignmentsLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#7C3AED" />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No assignments for this subject yet.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
              {item.description ? (
                <Text style={styles.cardDesc}>{item.description}</Text>
              ) : null}
              {item.due_date ? (
                <Text style={styles.dueDate}>
                  📅 Due: {new Date(item.due_date).toLocaleString()}
                </Text>
              ) : null}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Assignment</Text>
            <Text style={styles.modalSubject}>Subject: {selectedSubject?.title}</Text>
            <TextInput
              style={styles.input}
              placeholder="Title *"
              value={form.title}
              onChangeText={(v) => setForm({ ...form, title: v })}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Description (optional)"
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.input}
              placeholder="Due date (e.g. 2025-12-31T23:59)"
              value={form.due_date}
              onChangeText={(v) => setForm({ ...form, due_date: v })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setModalVisible(false); setForm({ title: '', description: '', due_date: '' }); }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? '...' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  subjectSelector: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  subjectChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  subjectChipActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  subjectChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  subjectChipTextActive: { color: '#fff' },
  list: { padding: 16, gap: 12, paddingBottom: 80 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1, marginRight: 8 },
  deleteIcon: { fontSize: 18 },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 6 },
  dueDate: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 15 },
  fab: {
    position: 'absolute', right: 24, bottom: 24,
    backgroundColor: '#7C3AED', width: 56, height: 56,
    borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  modalSubject: { fontSize: 13, color: '#7C3AED', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, fontSize: 15,
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#374151', fontWeight: '500' },
  saveBtn: { flex: 1, backgroundColor: '#7C3AED', borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});

export default TeacherAssignmentsScreen;
