import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';
import { mockUser } from '../../constants/mockData';

const menuItems = [
    { icon: '🔔', label: 'Notifications', sub: 'Manage alerts' },
    { icon: '🎨', label: 'Appearance', sub: 'Dark mode, themes' },
    { icon: '🔐', label: 'Security', sub: 'PIN, biometrics' },
    { icon: '💾', label: 'Export Data', sub: 'CSV, PDF reports' },
    { icon: '❓', label: 'Help & Support', sub: 'FAQs, contact us' },
];

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* Avatar + Info */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 32 }}>👤</Text>
                    </View>
                    <Text style={styles.name}>{mockUser.name}</Text>
                    <Text style={styles.email}>{mockUser.email}</Text>
                    <View style={styles.planBadge}>
                        <Text style={styles.planText}>⭐ {mockUser.plan} Plan</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuBox}>
                    {menuItems.map((item, i) => (
                        <TouchableOpacity key={i} style={styles.menuRow}>
                            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <Text style={styles.menuSub}>{item.sub}</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sign Out */}
                <TouchableOpacity
                    style={styles.signOutBtn}
                    onPress={() => router.replace('/(auth)/login')}
                >
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.sm },
    title: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 24 },
    profileCard: {
        alignItems: 'center',
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.primary,
        marginBottom: Spacing.sm,
    },
    name: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 20 },
    email: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 14, marginTop: 2 },
    planBadge: {
        backgroundColor: Colors.primary + '20',
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: Radius.full,
        marginTop: Spacing.sm,
    },
    planText: { fontFamily: Fonts.bodyMedium, color: Colors.primaryLight, fontSize: 13 },
    menuBox: {
        backgroundColor: Colors.bgCard,
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuLabel: { fontFamily: Fonts.bodyMedium, color: Colors.textPrimary, fontSize: 15 },
    menuSub: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 12, marginTop: 1 },
    chevron: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 22 },
    signOutBtn: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        paddingVertical: 14,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.danger,
        alignItems: 'center',
    },
    signOutText: { fontFamily: Fonts.headingSemiBold, color: Colors.danger, fontSize: 15 },
});
