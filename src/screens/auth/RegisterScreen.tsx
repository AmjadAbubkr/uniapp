import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { UserRole } from '@core/constants/roles';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const { register, is_loading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    await register(email, password, role, name);
  };

  const roles: UserRole[] = [UserRole.STUDENT, UserRole.TEACHER, UserRole.DEAN];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Select Role</Text>
      <View style={styles.roleContainer}>
        {roles.map(r => (
          <Button
            key={r}
            title={r}
            onPress={() => setRole(r)}
            color={role === r ? colors.primary : colors.outline}
          />
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {is_loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Sign In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors.onSurface,
  },
  label: {
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  error: {
    color: colors.error,
    marginBottom: 16,
  },
  link: {
    color: colors.primary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;
