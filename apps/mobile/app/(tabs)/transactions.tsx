import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';
import { mockTransactions } from '../../constants/mockData';

const filters = ['All', 'Income', 'Expense', 'Transfer'];

export default function TransactionsScreen() {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = mockTransactions.filter(tx => {
        const matchSearch = tx.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            activeFilter === 'All' || tx.type === activeFilter.toLowerCase();
        return matchSearch && matchFilter;
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transactions</Text>
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
                <Text style={{ fontSize: 16 }}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search transactions..."
                    placeholderTextColor={Colors.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {filters.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.chip, activeFilter === f && styles.chipActive]}
                        onPress={() => setActiveFilter(f)}
                    >
                        <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Transaction List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {filtered.map(tx => (
                    <View key={tx.id} style={styles.txRow}>
                        <View style={styles.txIcon}>
                            <Text style={{ fontSize: 20 }}>{tx.icon}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                            <Text style={styles.txTitle}>{tx.title}</Text>
                            <Text style={styles.txDate}>{tx.date}</Text>
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.sm },
    title: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 24 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgInput,
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: { flex: 1, color: Colors.textPrimary, fontFamily: Fonts.body, fontSize: 14 },
    filterRow: { paddingHorizontal: Spacing.lg, marginVertical: Spacing.md, maxHeight: 40 },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: Radius.full,
        backgroundColor: Colors.bgCard,
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontFamily: Fonts.bodyMedium, color: Colors.textSecondary, fontSize: 13 },
    chipTextActive: { color: Colors.white },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
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
    txDate: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 12 },
    txAmount: { fontFamily: Fonts.headingSemiBold, fontSize: 15 },
});
