/**
 * LocationAutocomplete.tsx
 * -------------------------
 * Calls Nominatim (OpenStreetMap) directly — no third-party wrapper,
 * no API key required.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MapPin } from 'lucide-react-native';

export interface NominatimResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  placeholder?: string;
  onSelect: (result: NominatimResult) => void;
  colors: any;
}

export function LocationAutocomplete({ placeholder, onSelect, colors }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(text.trim())}` +
          `&format=json&addressdetails=1&limit=6`;

        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en', 'User-Agent': 'TravelApp/1.0' },
        });
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const handleSelect = (item: NominatimResult) => {
    setQuery(item.display_name);
    setResults([]);
    onSelect(item);
  };

  return (
    <View>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.surface,
            borderColor: query ? colors.primary : colors.border,
          },
        ]}
      >
        <MapPin size={16} color={colors.textSecondary} strokeWidth={1.8} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={placeholder ?? 'Search for a place…'}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={search}
          autoCorrect={false}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator size="small" color={colors.textSecondary} />}
      </View>

      {results.length > 0 && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {results.map((item, index) => (
            <TouchableOpacity
              key={item.place_id}
              style={[
                styles.suggestion,
                index < results.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <MapPin size={13} color={colors.textSecondary} strokeWidth={1.8} style={{ marginTop: 2 }} />
              <Text
                style={[styles.suggestionText, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {item.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});