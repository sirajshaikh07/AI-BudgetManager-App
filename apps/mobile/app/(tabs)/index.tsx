import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';
import { mockUser, mockTransactions, mockBudgets, mockAccounts } from '../../constants/mockData';

const totalBalance = mockAccounts.reduce((sum, a) => sum + a.balance, 0);
const income = mockTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
const expenses = mockTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Greeting */}
                <View style={styles.greetingRow}>
                    <View>
                        <Text style={styles.greeting}>Good morning,</Text>
                        <Text style={styles.userName}>{mockUser.name} 👋</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 20 }}>👤</Text>
                    </View>
                </View>

                {/* Balance Card */}
                <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceAmount}>₹{totalBalance.toLocaleString()}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statIcon}>↑</Text>
                            <View>
                                <Text style={styles.statLabel}>Income</Text>
                                <Text style={styles.statValue}>₹{income.toLocaleString()}</Text>
                            </View>
                        </View>
                        <View style={styles.stat}>
                            <Text style={[styles.statIcon, { backgroundColor: 'rgba(239,68,68,0.2)' }]}>↓</Text>
                            <View>
                                <Text style={styles.statLabel}>Expenses</Text>
                                <Text style={styles.statValue}>₹{expenses.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* AI Nudge */}
                <View style={styles.aiCard}>
                    <Text style={{ fontSize: 20 }}>🤖</Text>
                    <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                        <Text style={styles.aiTitle}>AI Insight</Text>
                        <Text style={styles.aiText}>
                            Your transport spending is 93% of budget. Consider pooling rides this week.
                        </Text>
                    </View>
                </View>

                {/* Budget Overview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Budget Overview</Text>
                    {mockBudgets.slice(0, 3).map(b => (
                        <View key={b.id} style={styles.budgetRow}>
                            <View style={styles.budgetInfo}>
                                <Text style={{ fontSize: 18 }}>{b.icon}</Text>
                                <Text style={styles.budgetName}>{b.category}</Text>
                                <Text style={styles.budgetAmount}>
                                    ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.progressBg}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: `${Math.min((b.spent / b.limit) * 100, 100)}%`,
                                            backgroundColor:
                                                b.spent / b.limit > 0.85
                                                    ? Colors.danger
                                                    : b.spent / b.limit > 0.6
                                                        ? Colors.warning
                                                        : Colors.success,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {mockTransactions.slice(0, 5).map(tx => (
                        <View key={tx.id} style={styles.txRow}>
                            <View style={styles.txIcon}>
                                <Text style={{ fontSize: 20 }}>{tx.icon}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                                <Text style={styles.txTitle}>{tx.title}</Text>
                                <Text style={styles.txCategory}>{tx.category}</Text>
                            </View>
                            <Text
                                style={[
                                    styles.txAmount,
                                    { color: tx.type === 'income' ? Colors.success : Colors.danger },
                                ]}
                            >
                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.85}
                onPress={() => router.push('/add-transaction')}
            >
                <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    style={styles.fabGradient}
                >
                    <Text style={styles.fabText}>+</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    greetingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        paddingTop: 60,
    },
    greeting: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 14 },
    userName: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 22, marginTop: 2 },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    balanceCard: {
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
    },
    balanceLabel: { fontFamily: Fonts.body, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    balanceAmount: { fontFamily: Fonts.headingExtraBold, color: Colors.white, fontSize: 36, marginTop: 4 },
    statsRow: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.lg },
    stat: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(34,197,94,0.2)',
        textAlign: 'center',
        lineHeight: 32,
        fontSize: 16,
        overflow: 'hidden',
    },
    statLabel: { fontFamily: Fonts.body, color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    statValue: { fontFamily: Fonts.headingSemiBold, color: Colors.white, fontSize: 15 },
    aiCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    aiTitle: { fontFamily: Fonts.headingSemiBold, color: Colors.primaryLight, fontSize: 13 },
    aiText: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
    section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 18, marginBottom: Spacing.sm },
    seeAll: { fontFamily: Fonts.bodyMedium, color: Colors.primary, fontSize: 13 },
    budgetRow: { marginBottom: Spacing.md },
    budgetInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 },
    budgetName: { fontFamily: Fonts.bodyMedium, color: Colors.textPrimary, fontSize: 14, flex: 1 },
    budgetAmount: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 12 },
    progressBg: { height: 6, backgroundColor: Colors.bgInput, borderRadius: 3 },
    progressFill: { height: 6, borderRadius: 3 },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    txIcon: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        backgroundColor: Colors.bgInput,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txTitle: { fontFamily: Fonts.bodyMedium, color: Colors.textPrimary, fontSize: 14 },
    txCategory: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 12 },
    txAmount: { fontFamily: Fonts.headingSemiBold, fontSize: 15 },
    fab: { position: 'absolute', bottom: 80, right: Spacing.lg },
    fabGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: { color: Colors.white, fontSize: 28, fontWeight: '700', marginTop: -2 },
});
