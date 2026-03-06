import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        router.replace('/(tabs)');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Start managing your money like a pro
                    </Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Siraj Shaikh"
                        placeholderTextColor={Colors.textMuted}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="you@email.com"
                        placeholderTextColor={Colors.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Min 8 characters"
                        placeholderTextColor={Colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity onPress={handleRegister} activeOpacity={0.85}>
                        <LinearGradient
                            colors={[Colors.gradientStart, Colors.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}
                        >
                            <Text style={styles.btnText}>Create Account</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.terms}>
                        By signing up, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms</Text> &{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.footerLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
    header: { alignItems: 'center', marginBottom: Spacing.xl },
    title: {
        fontFamily: Fonts.headingExtraBold,
        fontSize: 28,
        color: Colors.textPrimary,
    },
    subtitle: {
        fontFamily: Fonts.body,
        fontSize: 15,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    form: { marginBottom: Spacing.lg },
    label: {
        fontFamily: Fonts.bodyMedium,
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
        marginTop: Spacing.md,
    },
    input: {
        backgroundColor: Colors.bgInput,
        borderRadius: Radius.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        fontFamily: Fonts.body,
        fontSize: 15,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    gradientBtn: {
        borderRadius: Radius.md,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    btnText: {
        fontFamily: Fonts.headingSemiBold,
        color: Colors.white,
        fontSize: 16,
    },
    terms: {
        fontFamily: Fonts.body,
        color: Colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        marginTop: Spacing.md,
        lineHeight: 18,
    },
    termsLink: { color: Colors.primaryLight },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
    footerText: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 14 },
    footerLink: { fontFamily: Fonts.headingSemiBold, color: Colors.primary, fontSize: 14 },
});
