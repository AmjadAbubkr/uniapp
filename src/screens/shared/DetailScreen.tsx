import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { UserService } from '@data/services';
import { SubjectService } from '@data/services';
import { User, Subject } from '@domain/types';

interface DetailScreenProps {
  route: any;
}

const DetailScreen = ({ route }: DetailScreenProps) => {
  const teacherId = route?.params?.teacherId;
  const studentId = route?.params?.studentId;
  const subjectId = route?.params?.subjectId;
  const [data, setData] = useState<User | Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherId || studentId) {
          const user = await UserService.getUser(teacherId || studentId);
          setData(user);
        } else if (subjectId) {
          const subject = await SubjectService.getById(subjectId);
          setData(subject);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherId, studentId, subjectId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Not found</Text>
      </View>
    );
  }

  const isUser = 'name' in data && 'role' in data;
  const isSubject = 'title' in data && 'description' in data;

  return (
    <View style={styles.container}>
      {isUser && (
        <Card title={(data as User).name} subtitle={(data as User).role}>
          <View style={styles.row}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{data.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Faculty:</Text>
            <Text style={styles.value}>{(data as User).facultyId || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Badge
              label={(data as User).isActive ? 'Active' : 'Inactive'}
              variant={(data as User).isActive ? 'success' : 'error'}
            />
          </View>
        </Card>
      )}
      {isSubject && (
        <Card title={(data as Subject).title} subtitle={(data as Subject).description}>
          <View style={styles.row}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{data.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Faculty:</Text>
            <Text style={styles.value}>{(data as Subject).facultyId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Teacher:</Text>
            <Text style={styles.value}>{(data as Subject).teacherId || 'Unassigned'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Schedule:</Text>
            <Text style={styles.value}>{(data as Subject).scheduleText || 'N/A'}</Text>
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    ...Typography.bodyLarge,
    color: colors.onSurfaceVariant,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  label: {
    ...Typography.labelLarge,
    color: colors.onSurfaceVariant,
    minWidth: 80,
  },
  value: {
    ...Typography.bodyMedium,
    color: colors.onSurface,
    flex: 1,
  },
});

export default DetailScreen;
