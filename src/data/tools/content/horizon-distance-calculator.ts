import { ToolContent } from '@/types/content';

export const horizonDistanceContent: ToolContent = {
  slug: 'horizon-distance-calculator',
  primaryKeyword: 'horizon distance calculator',
  searchIntent: 'Calculate distance to the visual and radar horizon based on observer height, including Earth curvature drop, hidden target height, and atmospheric refraction.',
  directAnswer: 'The distance to the horizon depends directly on observer eye height above the ground or sea surface. In a geometric vacuum, the line-of-sight distance is calculated by d = √(2·R·h + h²), where R is Earth\'s mean radius (6,371 km / 3,958.8 miles) and h is observer height. Under standard atmospheric conditions, optical refraction bends light downward, expanding the effective horizon by approximately 8% (effective radius factor k = 7/6), allowing a standing observer (5.71 ft / 1.74 m eye level) to see roughly 3.12 statute miles (5.02 km).',
  howTo: [
    {
      title: 'Set Observer Height Above Ground or Sea',
      description: 'Enter your eye-level elevation or choose a quick preset (Standing Person, Beach Lifeguard Tower, Lighthouse, Commercial Airliner, or ISS).',
    },
    {
      title: 'Select Atmospheric Refraction Model',
      description: 'Choose between Standard Optical Refraction (k = 7/6) for human vision and photography, Radio / Microwave (k = 4/3) for telecommunications, or Geometric Vacuum (k = 1.0) for pure geometrical curvature without atmosphere.',
    },
    {
      title: 'Inspect Horizon Distance & Dip Angle',
      description: 'Review the instant calculation cards showing line-of-sight distance, true horizon dip angle below the horizontal plane, and total visible surface area.',
    },
    {
      title: 'Analyze Target Concealment & Hidden Height',
      description: 'Enter a distant target\'s height and distance (such as an offshore lighthouse, ship mast, or coastal skyline) to calculate whether it is visible or how much is concealed below Earth\'s curvature.',
    },
    {
      title: 'Visualize Sightline & Export Geometries',
      description: 'Interact with the cross-sectional curvature diagram and interactive map coverage circle. Export the circular horizon buffer as GeoJSON, KML, CSV, or SVG.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Standing Beach Observer Looking at the Sea',
      scenario: 'A person with eye level at 5.71 feet (1.74 meters) stands at the water\'s edge on a clear ocean beach.',
      inputs: [
        { label: 'Observer Eye Height (h₁)', value: '5.71 ft (1.74 m)' },
        { label: 'Refraction Model', value: 'Standard Optical (k = 7/6 ≈ 1.167)' },
        { label: 'Target Distance', value: '5.0 statute miles' },
        { label: 'Target Height', value: '10.0 ft (small motorboat)' },
      ],
      steps: [
        'Compute effective Earth radius: R\' = 7/6 × 3,958.8 mi = 4,618.6 miles.',
        'Calculate horizon distance: d₁ = √(2 × 4,618.6 × (5.71 / 5,280)) ≈ 3.12 miles (5.02 km).',
        'Evaluate target distance beyond observer horizon: d_target - d₁ = 5.0 - 3.12 = 1.88 miles.',
        'Calculate Earth curvature drop at 5.0 miles: Drop = (5.0)² / (2 × 4,618.6) × 5,280 = 14.28 ft.',
        'Calculate concealed target height below horizon: Hidden = (1.88)² / (2 × 4,618.6) × 5,280 ≈ 2.02 ft.',
        'Compare target height (10.0 ft) with hidden height (2.02 ft): Target is Visible with ~7.98 ft showing above the horizon.',
      ],
      output: [
        { label: 'Horizon Distance', value: '3.12 Miles (5.02 km)' },
        { label: 'Horizon Dip Angle', value: '0.044° (2.6 arcminutes)' },
        { label: 'Earth Curvature Drop at 5 mi', value: '14.28 ft (4.35 m)' },
        { label: 'Target Concealment', value: 'Partially Visible (2.02 ft submerged below horizon)' },
      ],
      explanation: 'A standing adult sees the sea horizon just over 3 miles away. A 10-foot boat at 5 miles has its lower 2 feet obscured by the curvature of the Earth, but the top 8 feet remain clearly visible.',
    },
    {
      title: 'Worked Example 2: Coastal Lighthouse & Offshore Cargo Vessel',
      scenario: 'A maritime navigator calculates the maximum sighting distance between a 150-foot lighthouse lantern and a container ship with a 60-foot bridge tower.',
      inputs: [
        { label: 'Lighthouse Focal Plane (h₁)', value: '150.0 ft (45.72 m)' },
        { label: 'Ship Bridge Height (h₂)', value: '60.0 ft (18.29 m)' },
        { label: 'Atmospheric Condition', value: 'Standard Maritime Optical Refraction (k = 7/6)' },
      ],
      steps: [
        'Calculate lighthouse horizon distance: d₁ = 1.32 × √150 = 16.17 statute miles (14.05 NM).',
        'Calculate ship horizon distance: d₂ = 1.32 × √60 = 10.23 statute miles (8.89 NM).',
        'Sum both distances for combined line-of-sight range: d_total = d₁ + d₂ = 16.17 + 10.23 = 26.40 statute miles (22.94 NM).',
      ],
      output: [
        { label: 'Lighthouse Horizon (d₁)', value: '16.17 Miles (14.05 NM)' },
        { label: 'Ship Horizon (d₂)', value: '10.23 Miles (8.89 NM)' },
        { label: 'Maximum Sighting Range', value: '26.40 Miles (22.94 Nautical Miles)' },
      ],
      explanation: 'Because both the observer and target are elevated above sea level, their respective horizon radii sum together. The ship\'s bridge watch can detect the lighthouse beacon up to 22.94 nautical miles out at sea.',
    },
    {
      title: 'Worked Example 3: High-Altitude Commercial Jet at 36,000 Feet',
      scenario: 'A passenger at cruising altitude looks out the cabin window across a cloudless landscape.',
      inputs: [
        { label: 'Aircraft Flight Level (FL360)', value: '36,000 ft (10,973 m / 6.82 miles)' },
        { label: 'Atmospheric Refraction', value: 'Standard Optical (k = 7/6)' },
      ],
      steps: [
        'Calculate optical horizon distance: d = √(2 × 4,618.6 × (36,000 / 5,280)) = 251.1 statute miles (404.1 km / 218.2 NM).',
        'Calculate horizon dip angle: Dip = arccos(R / (R + h)) ≈ 3.37 degrees below the true astronomical horizon.',
        'Calculate visible surface area: A = 2π·R²·(h / (R + h)) ≈ 197,600 square miles (511,800 km²).',
      ],
      output: [
        { label: 'Visual Horizon Distance', value: '251.1 Miles (404.1 km)' },
        { label: 'Horizon Dip Angle', value: '3.37° below horizontal' },
        { label: 'Circular Horizon Ground Footprint', value: '197,600 sq mi (roughly the size of Spain)' },
      ],
      explanation: 'At 36,000 feet, the visual horizon recedes to over 250 miles in all directions, and the horizon dips perceptibly by more than 3.3 degrees below horizontal eye-level, making the Earth\'s curvature visibly apparent.',
    },
  ],
  resultExplanation: [
    {
      heading: 'Geometric Horizon vs. Atmospheric Refraction',
      body: 'In a vacuum, light travels in straight lines, yielding the purely geometric horizon d = √(2Rh + h²). In Earth\'s atmosphere, however, density decreases with altitude, creating a refractive index gradient. This causes light rays traveling nearly horizontally to bend slightly downward toward Earth\'s center. Standard optical refraction extends the visible horizon by roughly 8% compared to the vacuum calculation, modeled mathematically by scaling Earth\'s effective radius to k = 7/6 (R\' ≈ 7,433 km).',
    },
    {
      heading: 'Target Concealment & Earth Curvature Drop',
      body: 'The total drop of the spherical surface over distance d is h_drop = R(1 - cos(d/R)) ≈ d² / (2R). For any object situated beyond the observer\'s visual horizon (d > d₁), the portion of that object hidden below the curvature bulge is given by h_hidden = (d - d₁)² / (2R\'). If an object\'s physical height exceeds h_hidden, its summit or upper structure remains visible over the horizon.',
    },
    {
      heading: 'Dip of the Horizon in Celestial Navigation',
      body: 'Because the observer is elevated above the sea surface, the visible sea horizon appears slightly below the astronomical horizontal plane. This depression is called the dip of the horizon. In sextant celestial navigation, navigators must measure and subtract this dip correction from observed sextant altitudes to obtain accurate true celestial sights.',
    },
  ],
  methodology: {
    formulaTitle: 'Spherical Trigonometry & Effective Earth Radius (k-factor)',
    formulaDescription: 'Horizon distances are derived using exact spherical right-triangle trigonometry between the center of the Earth, the elevated observer, and the tangent point on the horizon sphere, combined with the standard atmospheric refractivity lapse rate.',
    mathFormula: 'd = \\sqrt{2 k R h + h^2} \\approx \\sqrt{2 k R h}, \\quad \\theta_{dip} = \\arccos\\left(\\frac{k R}{k R + h}\\right), \\quad h_{hidden} = \\frac{(d - d_1)^2}{2 k R}',
    datum: 'Mean Spherical Earth Radius R = 6,371,008 meters (IUGG WGS84 volumetric mean); 1 Statute Mile = 5,280 ft; 1 NM = 1,852 m',
    precision: 'Millimeter mathematical calculation precision; typical field accuracy ±3% governed by localized atmospheric temperature and barometric variations.',
    limitations: [
      'Assumes a standard International Standard Atmosphere (ISA) temperature lapse rate of -6.5°C/km.',
      'Thermal inversions over cold water or warm asphalt can produce looming, ducting, or mirage effects that distort the visual horizon.',
      'Does not account for local topographic obstructions, mountain ridges, or ocean swell heights.',
    ],
    sources: [
      { name: 'National Geospatial-Intelligence Agency (NGA) Pub. 9: The American Practical Navigator (Bowditch), Chapter 4', url: 'https://msi.nga.mil/Publications/APN' },
      { name: 'ITU-R Recommendation P.453-14: The radio refractive index and refractivity gradients', url: 'https://www.itu.int/rec/R-REC-P.453/en' },
      { name: 'French, A. P. (1982), How far away is the horizon?, American Journal of Physics, 50(9), 795-799', url: 'https://doi.org/10.1119/1.12995' },
    ],
  },
  limitations: [
    'Extreme thermal gradients over warm water or frozen ground cause mirages (inferior/superior) that can expand or invert visual sightlines.',
    'Surface wave swells in heavy maritime seas reduce effective eye height at the wave trough.',
    'Calculations model sea-level Earth curvature; when viewing across elevated land plateaus, the local ground elevation must be subtracted.',
  ],
  useCases: [
    {
      title: 'Maritime Navigation & Watchkeeping',
      audience: 'Captains, Navigators, Coastal Pilots, Coast Guard',
      description: 'Compute geographic sighting ranges for lighthouses, light vessels, buoys, and vessel traffic service (VTS) radar horizons.',
    },
    {
      title: 'Wireless Telecom & Microwave Backhaul Planning',
      audience: 'RF Network Engineers, Cellular Site Planners, WISP Operators',
      description: 'Calculate radio line-of-sight (LOS) clearance using the 4/3 effective Earth radius factor for microwave towers and point-to-point links.',
    },
    {
      title: 'Aviation Flight Operations & Visual Reconnaissance',
      audience: 'Pilots, Aerial Surveyors, Drone Operators (BVLOS)',
      description: 'Determine maximum visual range, horizon dip angle for instrument calibration, and ground footprint coverage from various flight altitudes.',
    },
    {
      title: 'Landscape Photography & Sightline Verification',
      audience: 'Outdoor Photographers, Surveyors, Geodesists',
      description: 'Verify whether distant landmarks, mountain peaks, or city skylines are geometrically visible over the curvature of the Earth before scouting shoots.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why do common rules of thumb like 1.22 × √h give slightly different numbers?',
      answer: 'The popular rule of thumb d (miles) ≈ 1.22 × √(h in feet) is an empirical shortcut for standard optical refraction. The exact geometric formula without refraction uses √(2Rh) ≈ 1.06 × √h, while optical refraction (k = 7/6) yields √(2 × 7/6 × R × h) ≈ 1.32 × √h for nautical miles and 1.15 to 1.32 for statute miles depending on unit conversions. Our calculator solves the exact spherical quadratic equation without truncating significant digits.',
    },
    {
      question: 'What is the difference between optical refraction and radio refraction?',
      answer: 'Light waves in the visual spectrum experience standard atmospheric bending modeled with effective Earth radius factor k = 7/6 (~1.17). Radio waves (VHF, UHF, microwave) are longer and more strongly refracted by atmospheric moisture, requiring an effective Earth radius factor k = 4/3 (~1.33). Radio horizons are therefore approximately 7% farther than visual horizons.',
    },
    {
      question: 'How do I tell if a distant mountain or building will be visible?',
      answer: 'Enter your elevation as Observer Eye Height, and the distance to the landmark as Target Distance. If the calculated "Target Concealment" (hidden height) is less than the physical height of the mountain or skyscraper, the portion exceeding the hidden height will be visible above the horizon.',
    },
    {
      question: 'Can I see the curvature of the Earth from an airplane?',
      answer: 'Yes. At typical cruising altitudes of 35,000 to 40,000 feet, the horizon dip angle is greater than 3.2 degrees, and the field of view covers a radius of over 240 miles. When viewing through a wide-angle field of view (such as 60 degrees or wider), the slight convex curvature of the sea horizon is visually detectable against a true horizontal reference line.',
    },
  ],
  faqs: [
    {
      question: 'How far is the horizon from a standing human?',
      answer: 'For an average adult standing at sea level with an eye height of 5 feet 7 inches (1.70 m), the horizon is approximately 2.9 miles (4.7 km) away in a geometric vacuum, and approximately 3.1 miles (5.0 km) away when accounting for standard optical refraction in Earth\'s atmosphere.',
    },
    {
      question: 'What is the formula for calculating distance to the horizon?',
      answer: 'The exact formula using the Pythagorean theorem on Earth\'s sphere is d = √(2Rh + h²), where R is the mean radius of Earth (~6,371 km or 3,959 miles) and h is the observer eye height in the same units. With atmospheric refraction, R is replaced by k·R, where k ≈ 7/6 for optical light and k ≈ 4/3 for radio waves.',
    },
    {
      question: 'What is Earth curvature drop per mile?',
      answer: 'Under flat Euclidean approximation, Earth\'s curvature drops at approximately 8 inches per mile squared (8 in/mi² or h ≈ 0.667·d² in feet). However, over long distances, this parabolic approximation diverges from true spherical curvature. Our calculator computes the exact spherical chord and atmospheric refraction drop.',
    },
    {
      question: 'What is the dip of the horizon?',
      answer: 'The dip of the horizon is the vertical angle between an observer\'s horizontal eye level (the astronomical horizon) and the visible sea horizon. As observer elevation increases, the dip angle grows: it is ~0.04° at eye level, ~0.6° at 1,000 feet, and ~3.4° at 36,000 feet.',
    },
    {
      question: 'Can you calculate line of sight between two elevated objects?',
      answer: 'Yes. When both the observer and target are elevated (such as two mountaintops, two radio towers, or a lighthouse and a ship), their total line-of-sight distance is the sum of their individual horizon distances: d_total = d_observer + d_target.',
    },
    {
      question: 'How does atmospheric mirage affect horizon distance?',
      answer: 'Atmospheric mirages occur when temperature gradients near the ground deviate dramatically from the standard lapse rate. Cold air trapped beneath warmer air (temperature inversion) bends light downward along Earth\'s curve ("looming"), greatly increasing visibility beyond the normal horizon. Conversely, intense ground heat creates "inferior mirages" (shimmering water appearance) where the horizon appears closer than normal.',
    },
  ],
  sources: [
    { name: 'National Geospatial-Intelligence Agency (NGA) Pub. 9: The American Practical Navigator (Bowditch), Chapter 4', url: 'https://msi.nga.mil/Publications/APN' },
    { name: 'ITU-R Recommendation P.453-14: The radio refractive index and refractivity gradients', url: 'https://www.itu.int/rec/R-REC-P.453/en' },
    { name: 'French, A. P. (1982), How far away is the horizon?, American Journal of Physics, 50(9), 795-799', url: 'https://doi.org/10.1119/1.12995' },
    { name: 'Young, A. T. (2004), Sunset science. IV. Low-altitude refraction, Applied Optics, 43(3), 660-672', url: 'https://doi.org/10.1364/AO.43.000660' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Geodesy Team',
    role: 'Geodetic Science & Maritime Navigation Lead',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'horizon-dist-wgs84-v1.0',
};
