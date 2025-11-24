/**
 * Home Page - Refactored Component-Based Architecture
 *
 * @description Main application page using composable components
 * Demonstrates clean separation of concerns and reusability
 *
 * Previous: 700-line monolithic component
 * Current: ~50 lines with composable architecture
 */

'use client';

import { useState } from 'react';
import { MainLayout } from '@/app/components/layout';
import { Container, Section } from '@/app/components/layout';
import { ArticleInput, AnalysisResults, Header, Footer } from '@/app/components/features';
import { useAnalysis } from '@/app/hooks/useAnalysis';

/**
 * Home page component
 *
 * @description Orchestrates the article analysis workflow
 * All UI logic is delegated to specialized components
 */
export default function HomePage() {
  const [articleText, setArticleText] = useState('');
  const { analyze, data, loading, error, clearError } = useAnalysis();

  const handleAnalyze = async () => {
    await analyze(articleText);
  };

  return (
    <MainLayout>
      <Section>
        <Container maxWidth="7xl">
          <Header />

          <ArticleInput
            value={articleText}
            onChange={setArticleText}
            onAnalyze={handleAnalyze}
            loading={loading}
            error={error}
            onClearError={clearError}
          />

          {data && <AnalysisResults data={data} />}

          <Footer />
        </Container>
      </Section>
    </MainLayout>
  );
}
