import React, { useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface PaginatedListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  fetchNextPage: () => Promise<void>;
  isLoading?: boolean;
  ListEmptyComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
}

export function PaginatedList<T>({
  data,
  renderItem,
  keyExtractor,
  fetchNextPage,
  isLoading = false,
  ListEmptyComponent,
  ListFooterComponent,
}: PaginatedListProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchNextPage();
    setIsLoadingMore(false);
  }, [fetchNextPage, isLoading, isLoadingMore]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No data found</Text>
          </View>
        )
      }
      contentContainerStyle={data.length === 0 && styles.emptyContainer}
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: colors.onSurfaceVariant,
  },
});
