import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';
import { mockAccounts } from '../../constants/mockData';

export default function AccountsScreen() {
    const total = mockAccounts.reduce((s, a) => s + a.balance, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Accounts</Text>
            </View>

            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Net Balance</Text>
                <Text style={styles.totalAmount}>₹{total.toLocaleString()}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {mockAccounts.map(acc => (
                    <View key={acc.id} style={styles.accCard}>
                        <Text style={{ fontSize: 28 }}>{acc.icon}</Text>
                        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                            <Text style={styles.accName}>{acc.name}</Text>
                            <Text style={styles.accType}>{acc.type.replace('_', ' ').toUpperCase()}</Text>
                        </View>
                        <Text
                            style={[
                                styles.accBalance,
                                { color: acc.balance >= 0 ? Colors.success : Colors.danger },
                            ]}
                        >
                            ₹{acc.balance.toLocaleString()}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.sm },
    title: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 24 },
    totalCard: {
        backgroundColor: Colors.bgCard,
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    totalLabel: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 13 },
    totalAmount: { fontFamily: Fonts.headingExtraBold, color: Colors.textPrimary, fontSize: 32, marginTop: 4 },
    accCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    accName: { fontFamily: Fonts.bodyMedium, color: Colors.textPrimary, fontSize: 15 },
    accType: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 11, marginTop: 2 },
    accBalance: { fontFamily: Fonts.heading, fontSize: 18 },
});
