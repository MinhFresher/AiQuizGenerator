import { StudySet } from '../types';

export const STARTER_STUDY_SET: StudySet = {
  id: 'starter-set-biology',
  title: 'Biology 101: Cell Structure & Function',
  description: 'Master the fundamental organelle structures, membranes, cellular transport mechanics, and respiration pathways.',
  createdDate: new Date('2026-07-01T10:00:00.000Z').toLocaleDateString(),
  sourceName: 'Course Lecture Notes (Biology 101)',
  questions: [
    {
      id: 'q1',
      text: 'Which organelle is primarily responsible for the synthesis of ATP through cellular respiration, earning the moniker "powerhouse of the cell"?',
      options: [
        'Lysosome',
        'Chloroplast',
        'Mitochondrion',
        'Golgi Apparatus'
      ],
      correctAnswerIndex: 2,
      explanation: 'Mitochondria generate most of the cell\'s biochemical supply of adenosine triphosphate (ATP) via the citric acid cycle and oxidative phosphorylation on their highly folded inner membranes (cristae).'
    },
    {
      id: 'q2',
      text: 'What is the primary macromolecular constituent of plant cell walls that provides rigidity and structural support?',
      options: [
        'Chitin',
        'Glycogen',
        'Peptidoglycan',
        'Cellulose'
      ],
      correctAnswerIndex: 3,
      explanation: 'Cellulose is a linear, insoluble polymer of beta-glucose units that forms tough microfibrils, establishing the rigid structural cell wall unique to plant cells.'
    },
    {
      id: 'q3',
      text: 'An animal cell placed in a highly hypertonic solution will experience which of the following phenomena?',
      options: [
        'Lysis (bursting due to water influx)',
        'Crenation (shriveling due to water efflux)',
        'Plasmolysis (membrane pulls away from wall)',
        'No net volumetric change'
      ],
      correctAnswerIndex: 1,
      explanation: 'In a hypertonic solution, the external solute concentration is higher than the cytoplasm. Water flows outward along its concentration gradient via osmosis, causing the animal cell to shrivel (crenation).'
    },
    {
      id: 'q4',
      text: 'Which cellular structure is directly involved in the synthesis of proteins destined for membrane insertion or secretion?',
      options: [
        'Smooth Endoplasmic Reticulum',
        'Rough Endoplasmic Reticulum',
        'Free Cytoplasmic Ribosomes',
        'Nucleolus'
      ],
      correctAnswerIndex: 1,
      explanation: 'The Rough Endoplasmic Reticulum is studded with ribosomes that actively translate and fold proteins directly into the ER lumen, preparing them for vesicular transport to the Golgi and beyond.'
    },
    {
      id: 'q5',
      text: 'What active transport mechanism moves three sodium ions out of the cell and two potassium ions into the cell against their respective concentration gradients?',
      options: [
        'Na+/K+ ATPase Pump',
        'Simple Aquaporin Diffusion',
        'Proton-Coupled Symport',
        'Receptor-Mediated Endocytosis'
      ],
      correctAnswerIndex: 0,
      explanation: 'The Na+/K+ ATPase pump consumes one molecule of ATP to pump 3 Na+ out and 2 K+ in, establishing the critical electrical resting potential of cell membranes.'
    }
  ],
  flashcards: [
    { id: 'f1', front: 'Mitochondria', back: 'Synthesizes ATP through aerobic respiration. Known as the powerhouse of the cell.' },
    { id: 'f2', front: 'Active Transport', back: 'Movement of substances across membranes against their concentration gradient, requiring energy input (ATP).' },
    { id: 'f3', front: 'Osmosis', back: 'The passive diffusion of water molecules across a selectively permeable membrane from low to high solute concentration.' },
    { id: 'f4', front: 'Lysosomes', back: 'Acidic organelles packed with hydrolytic enzymes to digest waste, foreign debris, and worn-out parts.' },
    { id: 'f5', front: 'Golgi Apparatus', back: 'Sorts, chemically modifies, packages, and tags proteins and lipids from the ER for secretion or routing.' }
  ],
  studyGuide: `# Study Summary: Cellular Structure and Function

Welcome to the ultimate cellular biology study guide! Use these curated notes to review core terminology, concepts, and physiological pathways before initiating tests.

## 1. Organelle Taxonomy & Systems
Cells are broadly categorized into **prokaryotic** (no membrane-bound nucleus or organelles) and **eukaryotic** (complex compartmentalized units).

- **The Nucleus:** House of chromatin (DNA wrapped in histones). The nucleolus inside coordinates ribosomal RNA synthesis.
- **Rough Endoplasmic Reticulum (RER):** Studded with ribosomes; synthesizes trans-membrane and secretory proteins.
- **Smooth Endoplasmic Reticulum (SER):** Active in lipid synthesis, hormone manufacturing, and calcium storage.
- **Mitochondria:** Double-membrane structures generating **ATP** via oxidative phosphorylation. Includes an outer boundary, an inner cristae boundary, and the matrix.

---

## 2. Membrane Biophysics & Transport
The cell boundary is a semi-permeable **phospholipid bilayer** studded with transport channels, receptors, and markers (fluid mosaic model).

### Passive Transport (No Energy Required)
- **Simple Diffusion:** Direct movement of small, nonpolar molecules (e.g., $O_2, CO_2$) along concentration gradients.
- **Facilitated Diffusion:** Large/polar molecules traveling via specific carrier/channel proteins (e.g., glucose transporters, aquaporins).
- **Osmosis:** Net movement of solvent (water) across selective membranes.

### Active Transport (Energy Input Needed)
- **Primary Active:** ATP directly hydrolyzed to pump ions against gradients (e.g., the sodium-potassium exchange pump).
- **Secondary Active (Cotranpsort):** Uses the gradient established by primary active pumps to drive other substrates (e.g., sodium-glucose symport).
`
};
