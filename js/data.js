window.PORTFOLIO_DATA = {
  name: "Abinash Prasana Selvanathan",
  email: "abinashprasana400@gmail.com",
  location: "Dublin, Ireland",
  links: {
    linkedin: "https://www.linkedin.com/in/abinash-prasana-s-2515b7221",
    github: "https://github.com/abinashprasana",
    resume: "assets/resume.pdf"
  },

  projects: [
    {
      title: "Clinical RAG — Medical Q&A on Clinical Notes",
      description: "A RAG pipeline for clinical question answering built on de-identified MIMIC-IV discharge notes, accessed via CITI ethics training and a PhysioNet Data Use Agreement. Achieves 70% accuracy at a mean latency of 10.91 seconds using section-aware chunking, FAISS vector search and Flan-T5, with a hard refusal when no relevant context is retrieved.",
      tags: ["Python", "FAISS", "Flan-T5", "Flask", "Clinical NLP", "RAG"],
      repo: "https://github.com/abinashprasana/clinical-rag-mimic"
    },
    {
      title: "PaperPilot — Local RAG Research Assistant",
      description: "A local semantic search and Q&A assistant for research PDFs that grounds every answer in retrieved document content, running entirely on CPU with no cloud API required. Tuned to chunk size 1,200, overlap 150 and top-k 6, it delivers around 25-second responses using Sentence Transformers for embeddings and Gemma 3 for generation.",
      tags: ["Python", "FAISS", "Ollama", "Streamlit", "Sentence Transformers", "RAG"],
      repo: "https://github.com/abinashprasana/paperpilot-ollama"
    },
    {
      title: "Dáil LLM — Irish Parliamentary Transformer",
      description: "A character-level transformer trained from scratch on 4.4 million Dáil Éireann parliamentary speeches spanning 1919 to 2013, with the full decoder-only architecture built in PyTorch using no pre-trained weights. The 3.2-million-parameter model achieved perplexity 4.07 and a repetition score of 0.0000, with a four-tab Streamlit dashboard and attention visualisation heatmaps.",
      tags: ["Python", "PyTorch", "Streamlit", "Transformer Architecture", "NLP"],
      repo: "https://github.com/abinashprasana/dail-llm"
    },
    {
      title: "NO₂ Forecasting — Deep Learning for Air Quality",
      description: "A benchmarking study comparing LSTM, GRU and Temporal Convolutional Network models for hourly NO₂ forecasting on real UK DEFRA sensor data from London's Marylebone Road. The best LSTM model achieved RMSE 6.09 µg/m³, outperforming GRU by around 20%, with a Flask dashboard for comparing predictions against actuals across time windows.",
      tags: ["Python", "TensorFlow", "LSTM", "GRU", "TCN", "Flask", "Time Series"],
      repo: "https://github.com/abinashprasana/no2-forecasting-deep-learning"
    },
    {
      title: "Steam Recommender — Explainable AI for Games",
      description: "A hybrid recommendation system combining Bayesian Personalised Ranking with content-based filtering on 31,799 real Steam interactions, extended with SHAP and LIME to explain individual recommendations. Achieved NDCG@10 of 0.5203 and MAP@10 of 0.4502, with post-hoc popularity bias analysis and two mitigation strategies surfaced through a Flask dashboard.",
      tags: ["Python", "BPR", "SHAP", "LIME", "Explainable AI", "Flask", "Recommender Systems"],
      repo: "https://github.com/abinashprasana/steam-recommender-xai"
    },
    {
      title: "Payments Analytics — PostgreSQL on Transaction Data",
      description: "A six-table PostgreSQL schema modelling payments architecture across 5,000 customers, 800 merchants and 80,000 synthetic transactions, with eight progressive SQL files covering window functions, CTEs and cohort analysis. Analysis reveals high-risk merchants carry roughly four times the fraud rate of low-risk merchants, presented in a four-tab Streamlit dashboard with Plotly visualisations.",
      tags: ["Python", "PostgreSQL 15", "psycopg2", "Streamlit", "Plotly", "SQL", "Cohort Analysis"],
      repo: "https://github.com/abinashprasana/payments-analytics"
    },
    {
      title: "RiskRadar — IT Incident SLA Risk Prediction",
      description: "A machine learning tool that predicts SLA breach risk for IT incidents drawn from 141,712 raw event logs, enabling faster triage through data-driven risk-band scoring. The Random Forest classifier achieved 92% accuracy, AUC-ROC 0.9684 and an F1 score of 0.887, correctly identifying 1,569 breach cases across 24,918 incidents.",
      tags: ["Python", "Scikit-learn", "Random Forest", "Streamlit", "Pandas"],
      repo: "https://github.com/abinashprasana/riskradar-it-incident-sla-risk"
    },
    {
      title: "Hospital Readmission Prediction",
      description: "An end-to-end ML pipeline on 101,766 diabetic patient records from the UCI Diabetes 130-US Hospitals dataset that predicts 30-day readmission risk using EDA, feature engineering and model comparison. XGBoost achieved ROC-AUC of 0.88 and outperformed the Random Forest baseline at 0.85, with full classification reports and confusion matrix evaluation.",
      tags: ["Python", "XGBoost", "Scikit-learn", "Pandas", "NumPy", "Healthcare Analytics"],
      repo: "https://github.com/abinashprasana/Hospital_Readmission_Prediction"
    },
    {
      title: "Irish News NLP — Topic Classification and Sentiment",
      description: "An NLP pipeline classifying Irish Times articles by topic and analysing sentiment across categories including Politics, Economy, Culture and Sport, using TF-IDF with up to 20,000 features. Linear SVM and Logistic Regression classifiers are compared with VADER sentiment tagging, with visualisations of accuracy, confusion matrices and per-category sentiment distribution.",
      tags: ["Python", "NLTK", "Scikit-learn", "TF-IDF", "VADER", "Pandas"],
      repo: "https://github.com/abinashprasana/Irish_News_NLP_Classification"
    }
  ],

  skills: [
    {
      name: "Python",
      category: "Languages & Core",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
      </svg>`
    },
    {
      name: "SQL",
      category: "Languages & Core",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>`
    },
    {
      name: "Machine Learning",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6"/>
        <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
        <path d="M1 12h6m6 0h6"/>
        <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
      </svg>`
    },
    {
      name: "Deep Learning",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>`
    },
    {
      name: "NLP",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
        <line x1="9" y1="14" x2="13" y2="14"/>
      </svg>`
    },
    {
      name: "RAG",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>`
    },
    {
      name: "PyTorch",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
      </svg>`
    },
    {
      name: "TensorFlow",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-.014-5.31L12.46 0v24l4.095-2.378V14.87l3.092 1.788-.018-4.618-3.074-1.756V7.603z"/>
      </svg>`
    },
    {
      name: "Scikit-learn",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>`
    },
    {
      name: "Hugging Face",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.5 10h.01M15.5 10h.01"/>
        <path d="M9.5 15.5a4 4 0 0 0 5 0"/>
        <path d="M8 8c0-1 .5-2 2-2M16 8c0-1-.5-2-2-2"/>
      </svg>`
    },
    {
      name: "Explainable AI",
      category: "ML & AI",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="M8 11h3m0 0h3m-3 0V8m0 3v3"/>
      </svg>`
    },
    {
      name: "Data Science",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>`
    },
    {
      name: "Pandas",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
      </svg>`
    },
    {
      name: "NumPy",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>`
    },
    {
      name: "PostgreSQL",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v5c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 10v4c0 1.66 4 3 9 3s9-1.34 9-3v-4"/>
        <path d="M3 14v5c0 1.66 4 3 9 3s9-1.34 9-3v-5"/>
      </svg>`
    },
    {
      name: "EDA",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>`
    },
    {
      name: "Time Series",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="2 18 6 10 10 15 14 7 18 12 22 6"/>
        <line x1="2" y1="21" x2="22" y2="21"/>
      </svg>`
    },
    {
      name: "Plotly",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="10.5" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      </svg>`
    },
    {
      name: "Data Visualization",
      category: "Data & Analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>`
    },
    {
      name: "Jupyter",
      category: "Tools & Workflow",
      icon: `<svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="3"/>
        <circle cx="6" cy="7" r="1.5"/>
        <circle cx="18" cy="7" r="1.5"/>
        <circle cx="18" cy="17" r="1.5"/>
      </svg>`
    },
    {
      name: "Flask",
      category: "Tools & Workflow",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 2v7.31a2 2 0 0 1-.26.99L4.5 18.5A2 2 0 0 0 6.27 21.5h11.46a2 2 0 0 0 1.77-2.96l-5.24-8.26A2 2 0 0 1 14 9.31V2"/>
        <line x1="8.5" y1="2" x2="15.5" y2="2"/>
        <circle cx="9.5" cy="15" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="13" cy="17" r="0.75" fill="currentColor" stroke="none"/>
      </svg>`
    },
    {
      name: "Git & GitHub",
      category: "Tools & Workflow",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>`
    },
    {
      name: "RESTful APIs",
      category: "Tools & Workflow",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>`
    }
  ]
};
