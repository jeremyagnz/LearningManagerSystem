import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { subjectAPI } from '../../services/api';

const TeacherSubjectsScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getMySubjects();
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleCreate = async () => {
    if (!form.title) return Alert.alert('Error', 'Title is required');
    setSaving(true);
    try {
      await subjectAPI.create(form);
      setModalVisible(false);
      setForm({ title: '', description: '' });
      await fetchSubjects();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Subject', 'This will delete all assignments and materials. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await subjectAPI.delete(id); await fetchSubjects(); } catch (err) { console.error(err); }
      }},
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#4F46E5" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No subjects yet. Create one!</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            <Text style={styles.students}>👥 {item.student_count} {parseInt(item.student_count) === 1 ? 'student' : 'students'} enrolled</Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteBtnText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Create Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Title *"
              value={form.title}
              onChangeText={(v) => setForm({ ...form, title: v })}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Description"
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
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
  list: { padding: 16, gap: 12, paddingBottom: 80 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 18, fontWeight: '600', color: '#111827' },
  desc: { fontSize: 13, color: '#9CA3AF', marginTop: 6 },
  students: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  deleteBtn: { marginTop: 12, alignSelf: 'flex-end' },
  deleteBtnText: { color: '#EF4444', fontSize: 14 },
  fab: { position: 'absolute', right: 24, bottom: 24, backgroundColor: '#4F46E5', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, fontSize: 15 },
  textarea: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#374151', fontWeight: '500' },
  saveBtn: { flex: 1, backgroundColor: '#4F46E5', borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 16 },
});

export default TeacherSubjectsScreen;
