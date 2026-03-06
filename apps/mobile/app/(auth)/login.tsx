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

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>💰</Text>
                    <Text style={styles.title}>Budget Pro</Text>
                    <Text style={styles.subtitle}>Take control of your finances</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
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
                        placeholder="••••••••"
                        placeholderTextColor={Colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
                        <LinearGradient
                            colors={[Colors.gradientStart, Colors.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}
                        >
                            <Text style={styles.btnText}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google */}
                    <TouchableOpacity style={styles.googleBtn}>
                        <Text style={styles.googleText}>🔵  Continue with Google</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.footerLink}>Sign Up</Text>
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
    logo: { fontSize: 56, marginBottom: Spacing.sm },
    title: {
        fontFamily: Fonts.headingExtraBold,
        fontSize: 32,
        color: Colors.textPrimary,
    },
    subtitle: {
        fontFamily: Fonts.body,
        fontSize: 15,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
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
    forgotBtn: { alignSelf: 'flex-end', marginTop: Spacing.sm },
    forgotText: {
        fontFamily: Fonts.body,
        color: Colors.primaryLight,
        fontSize: 13,
    },
    gradientBtn: {
        borderRadius: Radius.md,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    btnText: {
        fontFamily: Fonts.headingSemiBold,
        color: Colors.white,
        fontSize: 16,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: {
        fontFamily: Fonts.body,
        color: Colors.textMuted,
        paddingHorizontal: Spacing.md,
        fontSize: 13,
    },
    googleBtn: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingVertical: 14,
        alignItems: 'center',
    },
    googleText: {
        fontFamily: Fonts.bodyMedium,
        color: Colors.textPrimary,
        fontSize: 15,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    footerText: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 14 },
    footerLink: { fontFamily: Fonts.headingSemiBold, color: Colors.primary, fontSize: 14 },
});
