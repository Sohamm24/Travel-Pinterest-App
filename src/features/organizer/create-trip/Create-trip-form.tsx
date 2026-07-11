import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../constants/theme';
import {
  useCreateTripDraft,
  useUpdateBasicInfo,
  useUpdateItinerary,
  useUpdateInclusions,
  useUpdatePricing,
  useUpdateAudience,
  useUpdateDescription,
  usePublishTrip,
  useGetTrip,
} from './hooks';
import {
  INITIAL_FORM_VALUES,
  tripDraftStorageKey,
} from './types';
import type { CreateTripFormValues, StepKey } from './types';
import Step1BasicInfo from './components/Step-1';
import Step2Itinerary, { buildStep2Payload } from './components/Step-2';
import Step3Inclusions from './components/Step-3';
import Step4Pricing from './components/Step-4';
import Step5Audience from './components/Step-5';
import Step6DescriptionFAQ from './components/Step-6';
import TripPreview from './components/Preview';

const STEPS = [
  { key: 'info',        label: 'Basic Information' },
  { key: 'itinerary',   label: 'Trip Route & Itinerary' },
  { key: 'inclusions',  label: 'Inclusions and Exclusions' },
  { key: 'pricing',     label: 'Pricing and Seats' },
  { key: 'audience',    label: 'Target Audience' },
  { key: 'description', label: 'Description & FAQs' },
  { key: 'preview',     label: 'Review and Publish' },
] as const;

const STEP_ORDER: StepKey[] = [
  'info', 'itinerary', 'inclusions', 'pricing', 'audience', 'description',
];

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4,  Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function combineDateTime(date: string, time: string): string {
  if (!date || !time) return new Date().toISOString();
  const [day, month, year] = date.split(' ');
  const monthIndex = MONTHS[month];
  if (monthIndex === undefined) return new Date().toISOString();
  const [hours, minutes] = time.split(':');
  const d = new Date(
    Number(year),
    monthIndex,
    Number(day),
    Number(hours),
    Number(minutes),
  );
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function StepHeader({ stepIndex, colors }: { stepIndex: number; colors: any }) {
  const step = STEPS[stepIndex];
  return (
    <View style={styles.stepHeaderWrapper}>
      <View style={styles.stepTitleRow}>
        <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.stepBadgeNum, { color: '#fff' }]}>{stepIndex + 1}</Text>
        </View>
        <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{step.label}</Text>
      </View>
    </View>
  );
}

export default function CreateTripForm() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();

  const existingTripId: string | null = route.params?.tripId ?? null;

  const { watch, setValue, getValues, reset } = useForm<CreateTripFormValues>({
    defaultValues: INITIAL_FORM_VALUES,
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [tripId, setTripId] = useState<string | null>(existingTripId);
  const [storageReady, setStorageReady] = useState(false);
  const [shouldFetchBackend, setShouldFetchBackend] = useState(false);

  const createDraft = useCreateTripDraft();
  const updateBasicInfo = useUpdateBasicInfo();
  const updateItinerary = useUpdateItinerary();
  const updateInclusions = useUpdateInclusions();
  const updatePricing = useUpdatePricing();
  const updateAudience = useUpdateAudience();
  const updateDescription = useUpdateDescription();
  const publishTrip = usePublishTrip();

  const {
    data: backendDraft,
    isLoading: loadingDraft,
    isError: draftError,
  } = useGetTrip(existingTripId, shouldFetchBackend);

  const saveToStorage = useCallback(
    async (id: string, data: CreateTripFormValues) => {
      try {
        await AsyncStorage.setItem(tripDraftStorageKey(id), JSON.stringify(data));
      } catch (e) {
        if (__DEV__) console.error('Storage save failed:', e);
      }
    },
    [],
  );

  const loadFromStorage = useCallback(
    async (id: string): Promise<CreateTripFormValues | null> => {
      try {
        const raw = await AsyncStorage.getItem(tripDraftStorageKey(id));
        if (!raw) return null;
        return JSON.parse(raw) as CreateTripFormValues;
      } catch (e) {
        if (__DEV__) console.error('Storage load failed:', e);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    if (storageReady) return;

    const hydrate = async () => {
      if (!existingTripId) {
        setStorageReady(true);
        return;
      }

      const cached = await loadFromStorage(existingTripId);

      if (cached) {
        reset(cached);
        setStorageReady(true);
        return;
      }

      setShouldFetchBackend(true);
    };

    hydrate();
  }, [existingTripId, storageReady, reset, loadFromStorage]);

  useEffect(() => {
    if (!backendDraft || storageReady) return;

    reset({
      title: backendDraft.title ?? '',
      thumbnail: backendDraft.thumbnail ?? null,
      thumbnailPath: backendDraft.thumbnail ?? null,
      thumbnailUploading: false,
      itinerary: backendDraft.itinerary ?? [],
      inclusions: backendDraft.inclusions ?? {},
      maxTravellers: backendDraft.max_travellers?.toString() ?? '',
      budget: backendDraft.budget?.toString() ?? '',
      confirmationAmount: backendDraft.confirmation_amount?.toString() ?? '',
      confirmLastByDate: backendDraft.confirmation_deadline?.split('T')[0] ?? '',
      confirmLastByTime: backendDraft.confirmation_deadline?.split('T')[1]?.slice(0, 5) ?? '',
      audience: backendDraft.categories?.[0] ?? '',
      description: backendDraft.description ?? '',
      frequently_asked: backendDraft.frequently_asked ?? [],
    });

    setStepIndex(Math.min(backendDraft.last_completed_step, STEP_ORDER.length - 1));
    setStorageReady(true);
  }, [backendDraft, storageReady, reset]);

  useEffect(() => {
    if (draftError) {
      setStorageReady(true);
    }
  }, [draftError]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const debouncedSave = useCallback(
    (id: string, data: CreateTripFormValues) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveToStorage(id, data);
      }, 400);
    },
    [saveToStorage],
  );

  const formValues = watch();
  useEffect(() => {
    if (tripId && storageReady) {
      debouncedSave(tripId, formValues);
    }
  }, [formValues, tripId, storageReady, debouncedSave]);

  const currentStep = STEPS[stepIndex].key as StepKey | 'preview';
  const isFirst = stepIndex === 0;
  const isPreview = currentStep === 'preview';

  const submitting =
    createDraft.isPending ||
    updateBasicInfo.isPending ||
    updateItinerary.isPending ||
    updateInclusions.isPending ||
    updatePricing.isPending ||
    updateAudience.isPending ||
    updateDescription.isPending ||
    publishTrip.isPending;

  const persistCurrentStep = async (activeTripId: string): Promise<void> => {
    const values = getValues();

    switch (currentStep) {
      case 'info': {
        if (!values.title.trim()) return;
        await updateBasicInfo.mutateAsync({
          tripId: activeTripId,
          payload: { title: values.title.trim(), thumbnail: values.thumbnailPath ?? '' },
        });
        break;
      }
      case 'itinerary': {
        await updateItinerary.mutateAsync({
          tripId: activeTripId,
          payload: buildStep2Payload(values.itinerary),
        });
        break;
      }
      case 'inclusions': {
        await updateInclusions.mutateAsync({
          tripId: activeTripId,
          payload: { inclusions: values.inclusions },
        });
        break;
      }
      case 'pricing': {
        await updatePricing.mutateAsync({
          tripId: activeTripId,
          payload: {
            max_travellers: values.maxTravellers ? parseInt(values.maxTravellers) : undefined,
            budget: values.budget ? parseInt(values.budget) : undefined,
            confirmation_amount: values.confirmationAmount
              ? parseInt(values.confirmationAmount)
              : undefined,
            confirmation_deadline: combineDateTime(values.confirmLastByDate, values.confirmLastByTime),
          },
        });
        break;
      }
      case 'audience': {
        await updateAudience.mutateAsync({
          tripId: activeTripId,
          payload: { categories: values.audience ? [values.audience] : [] },
        });
        break;
      }
      case 'description': {
        await updateDescription.mutateAsync({
          tripId: activeTripId,
          payload: {
            description: values.description.trim(),
            frequently_asked: values.frequently_asked.filter(
              (f) => f.question.trim() && f.answer.trim(),
            ),
          },
        });
        break;
      }
      default: {
        if (__DEV__) console.warn('persistCurrentStep: unhandled step', currentStep);
        break;
      }
    }
  };

  const handleNext = async () => {
    const values = getValues();

    if (currentStep === 'info' && !values.title.trim()) {
      Alert.alert('Required', 'Please enter a trip title.');
      return;
    }

    try {
      let activeTripId = tripId;

      if (!activeTripId) {
        const draft = await createDraft.mutateAsync();
        activeTripId = draft.trip_id;
        setTripId(activeTripId);
        await saveToStorage(activeTripId, values);
      }

      await persistCurrentStep(activeTripId);
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.detail || 'Could not save this step. Please try again.');
    }
  };

  const handleBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSaveAndExit = () => navigation.goBack();

  const handleSubmit = async () => {
    if (!tripId) {
      Alert.alert('Error', 'Trip draft not found. Please restart.');
      return;
    }
    try {
      await publishTrip.mutateAsync({ tripId });
      await AsyncStorage.removeItem(tripDraftStorageKey(tripId));
      Alert.alert('Trip Published! 🎉', 'Your trip has been created successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.detail || 'Failed to publish trip. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'info':
        return <Step1BasicInfo watch={watch} setValue={setValue} tripId={tripId} />;
      case 'itinerary':
        return <Step2Itinerary watch={watch} setValue={setValue} tripId={tripId} />;
      case 'inclusions':
        return <Step3Inclusions watch={watch} setValue={setValue} />;
      case 'pricing':
        return <Step4Pricing watch={watch} setValue={setValue} />;
      case 'audience':
        return <Step5Audience watch={watch} setValue={setValue} />;
      case 'description':
        return <Step6DescriptionFAQ watch={watch} setValue={setValue} />;
      case 'preview':
        return <TripPreview formData={getValues()} colors={colors} />;
    }
  };

  if (existingTripId && (!storageReady || (shouldFetchBackend && loadingDraft))) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#fff', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleSaveAndExit}
          style={[styles.saveExitBtn, { backgroundColor: colors.background ?? '#EDE9FA' }]}
        >
          <ChevronLeft color={colors.primary} size={16} />
          <Text style={[styles.saveExitText, { color: colors.primary }]}>save and exit</Text>
        </TouchableOpacity>
      </View>

      <StepHeader stepIndex={stepIndex} colors={colors} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.outerCard, { backgroundColor: '#fff', borderColor: '#E5E7EB' }]}>
            <View style={[styles.progressTrackOnCard, { backgroundColor: '#E5E7EB' }]}>
              <View
                style={[
                  styles.progressFillOnCard,
                  {
                    backgroundColor: colors.primary,
                    width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={[styles.innerCard, { backgroundColor: '#fff', borderColor: '#C7C7D4' }]}>
              {renderStep()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { backgroundColor: '#F5F5F7', borderTopColor: '#E5E7EB' }]}>
        <TouchableOpacity
          style={[
            styles.prevBtn,
            { backgroundColor: isFirst ? '#E5E7EB' : (colors.background ?? '#EDE9FA') },
          ]}
          onPress={handleBack}
          disabled={isFirst}
        >
          <ChevronLeft color={isFirst ? '#9CA3AF' : colors.primary} size={20} />
          <Text style={[styles.prevBtnText, { color: isFirst ? '#9CA3AF' : colors.primary }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            { backgroundColor: isPreview ? '#2D5A1B' : colors.primary },
            submitting && { opacity: 0.7 },
          ]}
          onPress={isPreview ? handleSubmit : handleNext}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>{isPreview ? 'Publish' : 'Next'}</Text>
              <ChevronRight color="#fff" size={20} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { marginTop: 24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 6 },
  saveExitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  saveExitText: { fontSize: 14, fontFamily: TYPOGRAPHY.fontFamily },
  stepHeaderWrapper: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, gap: 12 },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBadge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  stepBadgeNum: { fontSize: 18, fontFamily: TYPOGRAPHY.fontFamilyBold },
  stepTitle: { fontSize: 20, fontFamily: TYPOGRAPHY.fontFamilyBold, flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  outerCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  progressTrackOnCard: { height: 5 },
  progressFillOnCard: { height: '100%', borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  innerCard: { margin: 12, borderRadius: 12, padding: 18 },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
  },
  prevBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 30,
  },
  prevBtnText: { fontSize: 16, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 30,
  },
  nextBtnText: { fontSize: 16, fontFamily: TYPOGRAPHY.fontFamilySemiBold, color: '#fff' },
});