import React, { useEffect, useState } from 'react';
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
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../constants/theme';
import {
  useUpdateBasicInfo,
  useUpdateItinerary,
  useUpdateInclusions,
  useUpdatePricing,
  useUpdateAudience,
  useUpdateDescription,
  usePublishTrip,
  useGetTrip,
} from './hooks';
import type { StepKey } from './types';
import Step1BasicInfo from './components/Step-1';
import Step2Itinerary, { buildStep2Payload } from './components/Step-2';
import Step3Inclusions from './components/Step-3';
import Step4Pricing from './components/Step-4';
import Step5Audience from './components/Step-5';
import Step6DescriptionFAQ from './components/Step-6';
import TripPreview from './components/Preview';

const STEPS = [
  { key: 'info', label: 'Basic Information' },
  { key: 'itinerary', label: 'Trip Route & Itinerary' },
  { key: 'inclusions', label: 'Inclusions and Exclusions' },
  { key: 'pricing', label: 'Pricing and Seats' },
  { key: 'audience', label: 'Target Audience' },
  { key: 'description', label: 'Description & FAQs' },
  { key: 'preview', label: 'Review and Publish' },
] as const;

const STEP_ORDER: StepKey[] = ['info', 'itinerary', 'inclusions', 'pricing', 'audience', 'description'];

const INITIAL_FORM = {
  title: '',
  thumbnail: null as any,
  itinerary: [] as any[],
  inclusions: {} as Record<string, boolean>,
  maxTravellers: '',
  budget: '',
  confirmationAmount: '',
  confirmLastByDate: '',
  confirmLastByTime: '',
  audience: '' as string,
  description: '',
  frequently_asked: [] as { question: string; answer: string }[],
};

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function combineDateTime(date: string, time: string): string {
  const [day, month, year] = date.split(' ');
  const [hours, minutes] = time.split(':');

  const d = new Date(
    Number(year),
    MONTHS[month],
    Number(day),
    Number(hours),
    Number(minutes)
  );

  return d.toISOString();
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

  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<any>(INITIAL_FORM);
  const [tripId, setTripId] = useState<string | null>(existingTripId);
  const [hydrated, setHydrated] = useState(!existingTripId);
  console.log(existingTripId)
  const { data: existingTrip, isLoading: loadingDraft } = useGetTrip(existingTripId);

  const updateBasicInfo = useUpdateBasicInfo();
  const updateItinerary = useUpdateItinerary();
  const updateInclusions = useUpdateInclusions();
  const updatePricing = useUpdatePricing();
  const updateAudience = useUpdateAudience();
  const updateDescription = useUpdateDescription();
  const publishTrip = usePublishTrip();

  useEffect(() => {
    if (existingTrip && !hydrated) {
      setFormData({
        title: existingTrip.title ?? '',
        thumbnail: existingTrip.thumbnail ?? null,
        itinerary: existingTrip.itinerary ?? [],
        inclusions: existingTrip.inclusions ?? {},
        maxTravellers: existingTrip.max_travellers?.toString() ?? '',
        budget: existingTrip.budget?.toString() ?? '',
        confirmationAmount: existingTrip.confirmation_amount?.toString() ?? '',
        confirmLastByDate: existingTrip.confirmation_deadline
          ? existingTrip.confirmation_deadline.split('T')[0]
          : '',
        confirmLastByTime: existingTrip.confirmation_deadline
          ? existingTrip.confirmation_deadline.split('T')[1]?.slice(0, 5)
          : '',
        audience: existingTrip.categories?.[0] ?? '',
        description: existingTrip.description ?? '',
        frequently_asked: existingTrip.frequently_asked ?? [],
      });
      setStepIndex(Math.min(existingTrip.last_completed_step, STEP_ORDER.length - 1));
      setHydrated(true);
    }
  }, [existingTrip, hydrated]);

  const currentStep = STEPS[stepIndex].key;
  const isFirst = stepIndex === 0;
  const isPreview = currentStep === 'preview';

  const submitting =
    updateBasicInfo.isPending ||
    updateItinerary.isPending ||
    updateInclusions.isPending ||
    updatePricing.isPending ||
    updateAudience.isPending ||
    updateDescription.isPending ||
    publishTrip.isPending;

  const persistCurrentStep = async (): Promise<string | null> => {
    switch (currentStep) {
      case 'info': {
        console.log(existingTripId)
        console.log(tripId)
        if (!formData.title.trim()) return null;
        await updateBasicInfo.mutateAsync({
          tripId,
          payload: { title: formData.title.trim(), thumbnail: formData.thumbnail },
        });
        return tripId;
      }
      case 'itinerary': {
        if (!tripId) return tripId;
        await updateItinerary.mutateAsync({ tripId, payload: buildStep2Payload(formData.itinerary) });
        return tripId;
      }
      case 'inclusions': {
        if (!tripId) return tripId;
        await updateInclusions.mutateAsync({ tripId, payload: { inclusions: formData.inclusions } });
        return tripId;
      }
      case 'pricing': {
        if (!tripId) return tripId;
        await updatePricing.mutateAsync({
          tripId,
          payload: {
            max_travellers: formData.maxTravellers ? parseInt(formData.maxTravellers) : undefined,
            budget: formData.budget ? parseInt(formData.budget) : undefined,
            confirmation_amount: formData.confirmationAmount
              ? parseInt(formData.confirmationAmount)
              : undefined,
            confirmation_deadline: combineDateTime(formData.confirmLastByDate, formData.confirmLastByTime),
          },
        });
        return tripId;
      }
      case 'audience': {
        if (!tripId) return tripId;
        await updateAudience.mutateAsync({
          tripId,
          payload: { categories: formData.audience ? [formData.audience] : [] },
        });
        return tripId;
      }
      case 'description': {
        if (!tripId) return tripId;
        await updateDescription.mutateAsync({
          tripId,
          payload: {
            description: formData.description.trim(),
            frequently_asked: formData.frequently_asked.filter(
              (f: any) => f.question.trim() && f.answer.trim()
            ),
          },
        });
        return tripId;
      }
      default:
        return tripId;
    }
  };

  const handleNext = async () => {
    if (currentStep === 'info' && !formData.title.trim()) {
      Alert.alert('Required', 'Please enter a trip title.');
      return;
    }
    try {
      await persistCurrentStep();
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    } catch (err: any) {
      console.log(err)
      Alert.alert('Error', err?.response?.data?.detail || 'Could not save this step. Please try again.');
    }
  };

  const handleBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSaveAndExit = async () => {
    try {
      await persistCurrentStep();
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.detail || 'Could not save your progress. Exit anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit anyway', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  const handleSubmit = async () => {
    if (!tripId) {
      Alert.alert('Error', 'Trip draft not found. Please restart.');
      return;
    }
    try {
      await publishTrip.mutateAsync({ tripId });
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
        return <Step1BasicInfo formData={formData} setFormData={setFormData} tripId={tripId} />;
      case 'itinerary':
        return <Step2Itinerary formData={formData} setFormData={setFormData} tripId={tripId}/>;
      case 'inclusions':
        return <Step3Inclusions formData={formData} setFormData={setFormData} />;
      case 'pricing':
        return <Step4Pricing formData={formData} setFormData={setFormData} />;
      case 'audience':
        return <Step5Audience formData={formData} setFormData={setFormData} />;
      case 'description':
        return <Step6DescriptionFAQ formData={formData} setFormData={setFormData} />;
      case 'preview':
        return <TripPreview formData={formData} colors={colors} />;
    }
  };

  if (existingTripId && loadingDraft) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#fff', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ffffffff' }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleSaveAndExit}
          disabled={submitting}
          style={[
            styles.saveExitBtn,
            { backgroundColor: colors.background ?? '#EDE9FA' },
            submitting && { opacity: 0.6 },
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <>
              <ChevronLeft color={colors.primary} size={16} />
              <Text style={[styles.saveExitText, { color: colors.primary }]}>save and exit</Text>
            </>
          )}
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
                  { backgroundColor: colors.primary, width: `${(stepIndex / (STEPS.length - 1)) * 100}%` },
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
          style={[styles.prevBtn, { backgroundColor: isFirst ? '#E5E7EB' : (colors.background ?? '#EDE9FA') }]}
          onPress={handleBack}
          disabled={isFirst}
        >
          <ChevronLeft color={isFirst ? '#9CA3AF' : colors.primary} size={20} />
          <Text style={[styles.prevBtnText, { color: isFirst ? '#9CA3AF' : colors.primary }]}>Previous</Text>
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
  prevBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 30 },
  prevBtnText: { fontSize: 16, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  nextBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 30 },
  nextBtnText: { fontSize: 16, fontFamily: TYPOGRAPHY.fontFamilySemiBold, color: '#fff' },
});