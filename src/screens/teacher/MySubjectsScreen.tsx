import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@store/authStore';
import { SubjectService } from '@data/services';
import { Subject } from '@domain/types';
import { Card } from '@components/common/Card';
import { EmptyState } from '@components/common/EmptyState';
import { Badge } from '@components/common/Badge';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';
import { withTimeout, unwrapResult } from '@core/utils/async';

const MySubjectsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubjects = useCallback(async () => {
    try {
      const data = unwrapResult(await withTimeout(SubjectService.getByTeacher(user!.id), 8000));
      if (data) setSubjects(data);
    } catch {} finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) loadSubjects();
  }, [user?.id, loadSubjects]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.sectionLoading} />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card title={item.title} subtitle={item.scheduleText || 'No schedule'}>
              <View style={styles.cardRow}>
                <Badge
                  label={item.isActive ? 'Active' : 'Inactive'}
                  variant={item.isActive ? 'success' : 'error'}
                />
                <TouchableOpacity onPress={() => navigation.navigate('GradeEntry', { subjectId: item.id })}>
                  <Text style={styles.link}>Enter Grades →</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="📚"
              title="No Subjects Assigned"
              subtitle="Subjects assigned to you will appear here"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  list: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  link: {
    ...Typography.labelLarge,
    color: colors.primary,
  },
  sectionLoading: {
    paddingVertical: 24,
  },
});

export default MySubjectsScreen;
