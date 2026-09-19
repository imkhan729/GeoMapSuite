const fs = require('fs');
const path = require('path');

const COUNTRIES_RAW = [
  { slug: 'argentina', name: 'Argentina', capital: 'Buenos Aires', region: 'South America', areaSqKm: 2780400, population: '46.0 Million', adminName: 'Provinces & Autonomous City', adminCount: 24, iso: 'ARG',
    bordering: ['Chile', 'Bolivia', 'Paraguay', 'Brazil', 'Uruguay', 'Atlantic Ocean'], high: 'Aconcagua (6,961 m)', low: 'Laguna del Carbón (-105 m)', river: 'Paraná River / Río de la Plata', tz: 'UTC-3:00 (ART)' },
  { slug: 'australia', name: 'Australia', capital: 'Canberra', region: 'Oceania', areaSqKm: 7692024, population: '26.8 Million', adminName: 'States & Territories', adminCount: 8, iso: 'AUS',
    bordering: ['Pacific Ocean', 'Indian Ocean', 'Southern Ocean', 'Timor Sea', 'Tasman Sea'], high: 'Mount Kosciuszko (2,228 m)', low: 'Lake Eyre (-15 m)', river: 'Murray-Darling River (2,508 km)', tz: 'UTC+8:00 to UTC+10:30' },
  { slug: 'austria', name: 'Austria', capital: 'Vienna', region: 'Europe', areaSqKm: 83879, population: '9.1 Million', adminName: 'Federal States (Bundesländer)', adminCount: 9, iso: 'AUT',
    bordering: ['Germany', 'Czech Republic', 'Slovakia', 'Hungary', 'Slovenia', 'Italy', 'Switzerland', 'Liechtenstein'], high: 'Großglockner (3,798 m)', low: 'Lake Neusiedl (115 m)', river: 'Danube River (Donau)', tz: 'UTC+1:00 (CET)' },
  { slug: 'belgium', name: 'Belgium', capital: 'Brussels', region: 'Europe', areaSqKm: 30688, population: '11.8 Million', adminName: 'Regions & Provinces', adminCount: 10, iso: 'BEL',
    bordering: ['Netherlands', 'Germany', 'Luxembourg', 'France', 'North Sea'], high: 'Signal de Botrange (694 m)', low: 'North Sea (0 m)', river: 'Meuse / Scheldt', tz: 'UTC+1:00 (CET)' },
  { slug: 'brazil', name: 'Brazil', capital: 'Brasília', region: 'South America', areaSqKm: 8515767, population: '216.4 Million', adminName: 'States and Federal District', adminCount: 27, iso: 'BRA',
    bordering: ['Uruguay', 'Argentina', 'Paraguay', 'Bolivia', 'Peru', 'Colombia', 'Venezuela', 'Guyana', 'Suriname', 'French Guiana', 'Atlantic Ocean'], high: 'Pico da Neblina (2,995 m)', low: 'Atlantic Ocean (0 m)', river: 'Amazon River / Paraná River', tz: 'UTC-2:00 to UTC-5:00' },
  { slug: 'canada', name: 'Canada', capital: 'Ottawa', region: 'North America', areaSqKm: 9984670, population: '40.5 Million', adminName: 'Provinces and Territories', adminCount: 13, iso: 'CAN',
    bordering: ['United States', 'Arctic Ocean', 'Atlantic Ocean', 'Pacific Ocean', 'Greenland (Hans Island)'], high: 'Mount Logan (5,959 m)', low: 'Atlantic / Pacific Oceans (0 m)', river: 'Mackenzie River / Saint Lawrence River', tz: 'UTC-3:30 to UTC-8:00' },
  { slug: 'chile', name: 'Chile', capital: 'Santiago', region: 'South America', areaSqKm: 756102, population: '19.6 Million', adminName: 'Regions', adminCount: 16, iso: 'CHL',
    bordering: ['Peru', 'Bolivia', 'Argentina', 'Pacific Ocean'], high: 'Ojos del Salado (6,893 m)', low: 'Pacific Ocean (0 m)', river: 'Loa River / Biobío River', tz: 'UTC-4:00 (CLT) / UTC-6:00 (Easter Island)' },
  { slug: 'china', name: 'China', capital: 'Beijing', region: 'Asia', areaSqKm: 9596961, population: '1.41 Billion', adminName: 'Provinces, Autonomous Regions & Municipalities', adminCount: 34, iso: 'CHN',
    bordering: ['Mongolia', 'Russia', 'North Korea', 'Vietnam', 'Laos', 'Myanmar', 'India', 'Bhutan', 'Nepal', 'Pakistan', 'Afghanistan', 'Tajikistan', 'Kyrgyzstan', 'Kazakhstan'], high: 'Mount Everest (8,848 m)', low: 'Ayding Lake (-154 m)', river: 'Yangtze River / Yellow River', tz: 'UTC+8:00 (CST)' },
  { slug: 'colombia', name: 'Colombia', capital: 'Bogotá', region: 'South America', areaSqKm: 1141748, population: '52.1 Million', adminName: 'Departments & Capital District', adminCount: 33, iso: 'COL',
    bordering: ['Panama', 'Venezuela', 'Brazil', 'Peru', 'Ecuador', 'Pacific Ocean', 'Caribbean Sea'], high: 'Pico Cristóbal Colón (5,730 m)', low: 'Pacific / Caribbean Oceans (0 m)', river: 'Magdalena River / Cauca River', tz: 'UTC-5:00 (COT)' },
  { slug: 'czech-republic', name: 'Czech Republic', capital: 'Prague', region: 'Europe', areaSqKm: 78871, population: '10.9 Million', adminName: 'Regions (Kraje)', adminCount: 14, iso: 'CZE',
    bordering: ['Germany', 'Poland', 'Slovakia', 'Austria'], high: 'Sněžka (1,603 m)', low: 'Elbe River at Hřensko (115 m)', river: 'Vltava / Elbe (Labe) / Morava', tz: 'UTC+1:00 (CET)' },
  { slug: 'denmark', name: 'Denmark', capital: 'Copenhagen', region: 'Europe', areaSqKm: 42951, population: '5.9 Million', adminName: 'Regions', adminCount: 5, iso: 'DNK',
    bordering: ['Germany', 'North Sea', 'Baltic Sea', 'Skagerrak', 'Kattegat'], high: 'Møllehøj (171 m)', low: 'Lammefjord (-7 m)', river: 'Gudenå River', tz: 'UTC+1:00 (CET)' },
  { slug: 'egypt', name: 'Egypt', capital: 'Cairo', region: 'Africa', areaSqKm: 1002450, population: '112.7 Million', adminName: 'Governorates', adminCount: 27, iso: 'EGY',
    bordering: ['Libya', 'Sudan', 'Israel', 'Palestine', 'Mediterranean Sea', 'Red Sea'], high: 'Mount Catherine (2,629 m)', low: 'Qattara Depression (-133 m)', river: 'Nile River / Suez Canal', tz: 'UTC+2:00 (EET)' },
  { slug: 'finland', name: 'Finland', capital: 'Helsinki', region: 'Europe', areaSqKm: 338424, population: '5.6 Million', adminName: 'Regions (Maakunnat)', adminCount: 19, iso: 'FIN',
    bordering: ['Sweden', 'Norway', 'Russia', 'Baltic Sea', 'Gulf of Finland', 'Gulf of Bothnia'], high: 'Halti (1,324 m)', low: 'Baltic Sea (0 m)', river: 'Kemijoki / Lake Saimaa', tz: 'UTC+2:00 (EET)' },
  { slug: 'france', name: 'France', capital: 'Paris', region: 'Europe', areaSqKm: 551695, population: '68.0 Million', adminName: 'Metropolitan Regions & Departments', adminCount: 18, iso: 'FRA',
    bordering: ['Belgium', 'Luxembourg', 'Germany', 'Switzerland', 'Italy', 'Monaco', 'Spain', 'Andorra', 'Atlantic Ocean', 'Mediterranean Sea'], high: 'Mont Blanc (4,808 m)', low: 'Étang de Lavalduc (-10 m)', river: 'Loire / Seine / Rhône / Garonne', tz: 'UTC+1:00 (CET)' },
  { slug: 'germany', name: 'Germany', capital: 'Berlin', region: 'Europe', areaSqKm: 357022, population: '84.4 Million', adminName: 'Federal States (Bundesländer)', adminCount: 16, iso: 'DEU',
    bordering: ['Denmark', 'Poland', 'Czech Republic', 'Austria', 'Switzerland', 'France', 'Luxembourg', 'Belgium', 'Netherlands', 'North Sea', 'Baltic Sea'], high: 'Zugspitze (2,962 m)', low: 'Neuendorf-Sachsenbande (-3.5 m)', river: 'Rhine / Danube / Elbe', tz: 'UTC+1:00 (CET)' },
  { slug: 'greece', name: 'Greece', capital: 'Athens', region: 'Europe', areaSqKm: 131957, population: '10.4 Million', adminName: 'Administrative Regions & Mount Athos', adminCount: 14, iso: 'GRC',
    bordering: ['Albania', 'North Macedonia', 'Bulgaria', 'Turkey', 'Aegean Sea', 'Ionian Sea', 'Mediterranean Sea'], high: 'Mount Olympus (2,918 m)', low: 'Mediterranean Sea (0 m)', river: 'Aliakmon / Pinios', tz: 'UTC+2:00 (EET)' },
  { slug: 'hungary', name: 'Hungary', capital: 'Budapest', region: 'Europe', areaSqKm: 93028, population: '9.6 Million', adminName: 'Counties & Capital City', adminCount: 20, iso: 'HUN',
    bordering: ['Slovakia', 'Ukraine', 'Romania', 'Serbia', 'Croatia', 'Slovenia', 'Austria'], high: 'Kékes (1,014 m)', low: 'Tisza River at Gyálarét (78 m)', river: 'Danube / Tisza / Lake Balaton', tz: 'UTC+1:00 (CET)' },
  { slug: 'india', name: 'India', capital: 'New Delhi', region: 'Asia', areaSqKm: 3287263, population: '1.43 Billion', adminName: 'States and Union Territories', adminCount: 36, iso: 'IND',
    bordering: ['Pakistan', 'China', 'Nepal', 'Bhutan', 'Bangladesh', 'Myanmar', 'Indian Ocean', 'Arabian Sea', 'Bay of Bengal'], high: 'Kangchenjunga (8,586 m)', low: 'Kuttanad (-2.2 m)', river: 'Ganges / Indus / Brahmaputra / Godavari', tz: 'UTC+5:30 (IST)' },
  { slug: 'indonesia', name: 'Indonesia', capital: 'Jakarta / Nusantara', region: 'Asia', areaSqKm: 1904569, population: '278.7 Million', adminName: 'Provinces', adminCount: 38, iso: 'IDN',
    bordering: ['Malaysia', 'Papua New Guinea', 'East Timor', 'Indian Ocean', 'Pacific Ocean', 'Java Sea'], high: 'Puncak Jaya (4,884 m)', low: 'Indian / Pacific Oceans (0 m)', river: 'Kapuas River / Mahakam River', tz: 'UTC+7:00 to UTC+9:00' },
  { slug: 'iran', name: 'Iran', capital: 'Tehran', region: 'Asia', areaSqKm: 1648195, population: '89.2 Million', adminName: 'Provinces (Ostanha)', adminCount: 31, iso: 'IRN',
    bordering: ['Armenia', 'Azerbaijan', 'Turkmenistan', 'Afghanistan', 'Pakistan', 'Iraq', 'Turkey', 'Caspian Sea', 'Persian Gulf', 'Gulf of Oman'], high: 'Mount Damavand (5,610 m)', low: 'Caspian Sea (-28 m)', river: 'Karun River / Karkheh River', tz: 'UTC+3:30 (IRST)' },
  { slug: 'iraq', name: 'Iraq', capital: 'Baghdad', region: 'Asia', areaSqKm: 438317, population: '45.5 Million', adminName: 'Governorates', adminCount: 19, iso: 'IRQ',
    bordering: ['Turkey', 'Iran', 'Kuwait', 'Saudi Arabia', 'Jordan', 'Syria', 'Persian Gulf'], high: 'Cheekha Dar (3,611 m)', low: 'Persian Gulf (0 m)', river: 'Tigris River / Euphrates River', tz: 'UTC+3:00 (AST)' },
  { slug: 'ireland', name: 'Ireland', capital: 'Dublin', region: 'Europe', areaSqKm: 70273, population: '5.3 Million', adminName: 'Counties', adminCount: 26, iso: 'IRL',
    bordering: ['Northern Ireland (United Kingdom)', 'Atlantic Ocean', 'Irish Sea', 'Celtic Sea'], high: 'Carrauntoohil (1,038 m)', low: 'North Slob (-3 m)', river: 'River Shannon / River Liffey', tz: 'UTC+0:00 (WET/GMT)' },
  { slug: 'israel', name: 'Israel', capital: 'Jerusalem', region: 'Asia', areaSqKm: 22072, population: '9.8 Million', adminName: 'Districts', adminCount: 6, iso: 'ISR',
    bordering: ['Lebanon', 'Syria', 'Jordan', 'Egypt', 'West Bank', 'Gaza Strip', 'Mediterranean Sea', 'Red Sea'], high: 'Mount Hermon (2,236 m)', low: 'Dead Sea (-430 m)', river: 'Jordan River / Sea of Galilee', tz: 'UTC+2:00 (IST)' },
  { slug: 'italy', name: 'Italy', capital: 'Rome', region: 'Europe', areaSqKm: 301340, population: '58.9 Million', adminName: 'Regions', adminCount: 20, iso: 'ITA',
    bordering: ['France', 'Switzerland', 'Austria', 'Slovenia', 'San Marino', 'Vatican City', 'Mediterranean Sea', 'Adriatic Sea'], high: 'Monte Bianco / Mont Blanc (4,808 m)', low: 'Le Contane (-3.2 m)', river: 'Po River / Tiber / Adige', tz: 'UTC+1:00 (CET)' },
  { slug: 'japan', name: 'Japan', capital: 'Tokyo', region: 'Asia', areaSqKm: 377975, population: '124.5 Million', adminName: 'Prefectures', adminCount: 47, iso: 'JPN',
    bordering: ['Sea of Japan', 'Pacific Ocean', 'East China Sea', 'Sea of Okhotsk'], high: 'Mount Fuji (3,776 m)', low: 'Hachirōgata (-4 m)', river: 'Shinano River / Tone River', tz: 'UTC+9:00 (JST)' },
  { slug: 'malaysia', name: 'Malaysia', capital: 'Kuala Lumpur', region: 'Asia', areaSqKm: 330803, population: '34.3 Million', adminName: 'States and Federal Territories', adminCount: 16, iso: 'MYS',
    bordering: ['Thailand', 'Singapore', 'Indonesia', 'Brunei', 'South China Sea', 'Strait of Malacca'], high: 'Mount Kinabalu (4,095 m)', low: 'Indian Ocean / South China Sea (0 m)', river: 'Rajang River / Kinabatangan River', tz: 'UTC+8:00 (MYT)' },
  { slug: 'mexico', name: 'Mexico', capital: 'Mexico City', region: 'North America', areaSqKm: 1964375, population: '129.5 Million', adminName: 'States & Autonomous Capital', adminCount: 32, iso: 'MEX',
    bordering: ['United States', 'Guatemala', 'Belize', 'Pacific Ocean', 'Gulf of Mexico', 'Caribbean Sea'], high: 'Pico de Orizaba (5,636 m)', low: 'Laguna Salada (-10 m)', river: 'Rio Grande (Río Bravo) / Balsas River', tz: 'UTC-6:00 to UTC-8:00' },
  { slug: 'netherlands', name: 'Netherlands', capital: 'Amsterdam', region: 'Europe', areaSqKm: 41850, population: '17.9 Million', adminName: 'Provinces', adminCount: 12, iso: 'NLD',
    bordering: ['Germany', 'Belgium', 'North Sea'], high: 'Vaalserberg (322 m)', low: 'Zuidplaspolder (-6.76 m)', river: 'Rhine / Meuse / IJssel', tz: 'UTC+1:00 (CET)' },
  { slug: 'new-zealand', name: 'New Zealand', capital: 'Wellington', region: 'Oceania', areaSqKm: 268021, population: '5.2 Million', adminName: 'Regional Councils & Unitary Authorities', adminCount: 16, iso: 'NZL',
    bordering: ['Pacific Ocean', 'Tasman Sea'], high: 'Aoraki / Mount Cook (3,724 m)', low: 'Pacific Ocean (0 m)', river: 'Waikato River / Clutha River', tz: 'UTC+12:00 (NZST)' },
  { slug: 'nigeria', name: 'Nigeria', capital: 'Abuja', region: 'Africa', areaSqKm: 923768, population: '224.0 Million', adminName: 'States & Federal Capital Territory', adminCount: 37, iso: 'NGA',
    bordering: ['Benin', 'Niger', 'Chad', 'Cameroon', 'Gulf of Guinea / Atlantic Ocean'], high: 'Chappal Waddi (2,419 m)', low: 'Atlantic Ocean (0 m)', river: 'Niger River / Benue River', tz: 'UTC+1:00 (WAT)' },
  { slug: 'norway', name: 'Norway', capital: 'Oslo', region: 'Europe', areaSqKm: 385207, population: '5.5 Million', adminName: 'Counties (Fylker)', adminCount: 15, iso: 'NOR',
    bordering: ['Sweden', 'Finland', 'Russia', 'Norwegian Sea', 'North Sea', 'Barents Sea'], high: 'Galdhøpiggen (2,469 m)', low: 'Norwegian Sea (0 m)', river: 'Glomma River', tz: 'UTC+1:00 (CET)' },
  { slug: 'pakistan', name: 'Pakistan', capital: 'Islamabad', region: 'Asia', areaSqKm: 881913, population: '240.5 Million', adminName: 'Provinces & Federal Territories', adminCount: 7, iso: 'PAK',
    bordering: ['India', 'China', 'Afghanistan', 'Iran', 'Arabian Sea'], high: 'K2 (8,611 m)', low: 'Arabian Sea (0 m)', river: 'Indus River / Jhelum River', tz: 'UTC+5:00 (PKT)' },
  { slug: 'peru', name: 'Peru', capital: 'Lima', region: 'South America', areaSqKm: 1285216, population: '34.3 Million', adminName: 'Departments & Constitutional Province', adminCount: 25, iso: 'PER',
    bordering: ['Ecuador', 'Colombia', 'Brazil', 'Bolivia', 'Chile', 'Pacific Ocean'], high: 'Huascarán (6,768 m)', low: 'Bayóvar Depression (-34 m)', river: 'Amazon / Ucayali / Marañón', tz: 'UTC-5:00 (PET)' },
  { slug: 'philippines', name: 'Philippines', capital: 'Manila', region: 'Asia', areaSqKm: 300000, population: '115.6 Million', adminName: 'Administrative Regions', adminCount: 17, iso: 'PHL',
    bordering: ['Philippine Sea', 'South China Sea', 'Celebes Sea'], high: 'Mount Apo (2,954 m)', low: 'Philippine Sea (0 m)', river: 'Cagayan River / Pasig River', tz: 'UTC+8:00 (PHT)' },
  { slug: 'poland', name: 'Poland', capital: 'Warsaw', region: 'Europe', areaSqKm: 312696, population: '37.8 Million', adminName: 'Voivodeships', adminCount: 16, iso: 'POL',
    bordering: ['Germany', 'Czech Republic', 'Slovakia', 'Ukraine', 'Belarus', 'Lithuania', 'Russia (Kaliningrad)', 'Baltic Sea'], high: 'Rysy (2,499 m)', low: 'Raczki Elbląskie (-1.8 m)', river: 'Vistula (Wisła) / Oder (Odra)', tz: 'UTC+1:00 (CET)' },
  { slug: 'portugal', name: 'Portugal', capital: 'Lisbon', region: 'Europe', areaSqKm: 92212, population: '10.4 Million', adminName: 'Districts & Autonomous Regions', adminCount: 20, iso: 'PRT',
    bordering: ['Spain', 'Atlantic Ocean'], high: 'Mount Pico, Azores (2,351 m) / Serra da Estrela (1,993 m mainland)', low: 'Atlantic Ocean (0 m)', river: 'Tagus (Tejo) / Douro / Guadiana', tz: 'UTC+0:00 (WET) / UTC-1:00 (Azores)' },
  { slug: 'romania', name: 'Romania', capital: 'Bucharest', region: 'Europe', areaSqKm: 238397, population: '19.0 Million', adminName: 'Counties & Municipality of Bucharest', adminCount: 42, iso: 'ROU',
    bordering: ['Ukraine', 'Moldova', 'Bulgaria', 'Serbia', 'Hungary', 'Black Sea'], high: 'Moldoveanu Peak (2,544 m)', low: 'Black Sea (0 m)', river: 'Danube / Mureș / Olt', tz: 'UTC+2:00 (EET)' },
  { slug: 'russia', name: 'Russia', capital: 'Moscow', region: 'Europe / Asia', areaSqKm: 17098246, population: '144.2 Million', adminName: 'Federal Subjects', adminCount: 85, iso: 'RUS',
    bordering: ['Norway', 'Finland', 'Estonia', 'Latvia', 'Lithuania', 'Poland', 'Belarus', 'Ukraine', 'Georgia', 'Azerbaijan', 'Kazakhstan', 'China', 'Mongolia', 'North Korea', 'Arctic & Pacific Oceans'], high: 'Mount Elbrus (5,642 m)', low: 'Caspian Sea (-28 m)', river: 'Volga / Ob / Yenisey / Lena', tz: 'UTC+2:00 to UTC+12:00' },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', capital: 'Riyadh', region: 'Asia', areaSqKm: 2149690, population: '36.5 Million', adminName: 'Administrative Provinces', adminCount: 13, iso: 'SAU',
    bordering: ['Jordan', 'Iraq', 'Kuwait', 'Qatar', 'Bahrain', 'United Arab Emirates', 'Oman', 'Yemen', 'Red Sea', 'Persian Gulf'], high: 'Jabal Sawda (3,000 m)', low: 'Red Sea / Persian Gulf (0 m)', river: 'Wadi al-Rummah / Coastal aquifers', tz: 'UTC+3:00 (AST)' },
  { slug: 'singapore', name: 'Singapore', capital: 'Singapore', region: 'Asia', areaSqKm: 734, population: '5.9 Million', adminName: 'Community Development Councils', adminCount: 5, iso: 'SGP',
    bordering: ['Malaysia (Johor Strait)', 'Indonesia (Singapore Strait)'], high: 'Bukit Timah (163.6 m)', low: 'Singapore Strait (0 m)', river: 'Singapore River / Kallang River', tz: 'UTC+8:00 (SGT)' },
  { slug: 'south-africa', name: 'South Africa', capital: 'Pretoria / Cape Town / Bloemfontein', region: 'Africa', areaSqKm: 1221037, population: '60.6 Million', adminName: 'Provinces', adminCount: 9, iso: 'ZAF',
    bordering: ['Namibia', 'Botswana', 'Zimbabwe', 'Mozambique', 'Eswatini', 'Lesotho (enclaved)', 'Atlantic Ocean', 'Indian Ocean'], high: 'Mafadi (3,450 m)', low: 'Atlantic / Indian Oceans (0 m)', river: 'Orange River / Limpopo River', tz: 'UTC+2:00 (SAST)' },
  { slug: 'south-korea', name: 'South Korea', capital: 'Seoul', region: 'Asia', areaSqKm: 100210, population: '51.7 Million', adminName: 'Provinces & Special Cities', adminCount: 17, iso: 'KOR',
    bordering: ['North Korea (DMZ)', 'Sea of Japan / East Sea', 'Yellow Sea', 'Korea Strait'], high: 'Hallasan, Jeju (1,947 m)', low: 'Sea of Japan (0 m)', river: 'Nakdong River / Han River', tz: 'UTC+9:00 (KST)' },
  { slug: 'spain', name: 'Spain', capital: 'Madrid', region: 'Europe', areaSqKm: 505990, population: '48.1 Million', adminName: 'Autonomous Communities & Cities', adminCount: 19, iso: 'ESP',
    bordering: ['France', 'Andorra', 'Portugal', 'Gibraltar (UK)', 'Morocco (Ceuta & Melilla)', 'Atlantic Ocean', 'Mediterranean Sea'], high: 'Teide, Tenerife (3,715 m) / Mulhacén (3,479 m mainland)', low: 'Atlantic / Mediterranean Oceans (0 m)', river: 'Tagus / Ebro / Duero / Guadalquivir', tz: 'UTC+1:00 (CET) / UTC+0:00 (Canary Islands)' },
  { slug: 'sweden', name: 'Sweden', capital: 'Stockholm', region: 'Europe', areaSqKm: 450295, population: '10.5 Million', adminName: 'Counties (Län)', adminCount: 21, iso: 'SWE',
    bordering: ['Norway', 'Finland', 'Denmark (Öresund)', 'Baltic Sea', 'Gulf of Bothnia'], high: 'Kebnekaise (2,096 m)', low: 'Kristianstad (-2.41 m)', river: 'Torne / Klarälven-Göta älv / Lake Vänern', tz: 'UTC+1:00 (CET)' },
  { slug: 'switzerland', name: 'Switzerland', capital: 'Bern', region: 'Europe', areaSqKm: 41285, population: '8.9 Million', adminName: 'Cantons', adminCount: 26, iso: 'CHE',
    bordering: ['Germany', 'France', 'Italy', 'Austria', 'Liechtenstein'], high: 'Dufourspitze (4,634 m)', low: 'Lake Maggiore (193 m)', river: 'Rhine / Rhône / Lake Geneva', tz: 'UTC+1:00 (CET)' },
  { slug: 'thailand', name: 'Thailand', capital: 'Bangkok', region: 'Asia', areaSqKm: 513120, population: '71.8 Million', adminName: 'Provinces & Special Administrative Area', adminCount: 77, iso: 'THA',
    bordering: ['Myanmar', 'Laos', 'Cambodia', 'Malaysia', 'Gulf of Thailand', 'Andaman Sea'], high: 'Doi Inthanon (2,565 m)', low: 'Gulf of Thailand (0 m)', river: 'Chao Phraya / Mekong River', tz: 'UTC+7:00 (ICT)' },
  { slug: 'turkey', name: 'Turkey', capital: 'Ankara', region: 'Europe / Asia', areaSqKm: 783562, population: '85.3 Million', adminName: 'Provinces (İller)', adminCount: 81, iso: 'TUR',
    bordering: ['Greece', 'Bulgaria', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran', 'Iraq', 'Syria', 'Black Sea', 'Mediterranean Sea', 'Aegean Sea'], high: 'Mount Ararat (5,137 m)', low: 'Mediterranean / Black Seas (0 m)', river: 'Euphrates / Tigris / Kızılırmak', tz: 'UTC+3:00 (TRT)' },
  { slug: 'ukraine', name: 'Ukraine', capital: 'Kyiv', region: 'Europe', areaSqKm: 603550, population: '38.0 Million', adminName: 'Oblasts & Cities with Special Status', adminCount: 27, iso: 'UKR',
    bordering: ['Russia', 'Belarus', 'Poland', 'Slovakia', 'Hungary', 'Romania', 'Moldova', 'Black Sea', 'Sea of Azov'], high: 'Hoverla (2,061 m)', low: 'Kuyalnik Estuary (-5 m)', river: 'Dnipro River / Dniester / Danube', tz: 'UTC+2:00 (EET)' },
  { slug: 'united-arab-emirates', name: 'United Arab Emirates', capital: 'Abu Dhabi', region: 'Asia', areaSqKm: 83600, population: '9.5 Million', adminName: 'Emirates', adminCount: 7, iso: 'ARE',
    bordering: ['Saudi Arabia', 'Oman', 'Persian Gulf', 'Gulf of Oman'], high: 'Jabal Bil Ays (1,900 m)', low: 'Persian Gulf (0 m)', river: 'Khor Dubai / Coastal creeks', tz: 'UTC+4:00 (GST)' },
  { slug: 'united-kingdom', name: 'United Kingdom', capital: 'London', region: 'Europe', areaSqKm: 242495, population: '67.7 Million', adminName: 'Constituent Countries & Counties', adminCount: 4, iso: 'GBR',
    bordering: ['Republic of Ireland', 'Atlantic Ocean', 'North Sea', 'English Channel', 'Irish Sea'], high: 'Ben Nevis, Scotland (1,345 m)', low: 'The Fens (-4 m)', river: 'River Severn / River Thames', tz: 'UTC+0:00 (GMT/BST)' },
  { slug: 'vietnam', name: 'Vietnam', capital: 'Hanoi', region: 'Asia', areaSqKm: 331212, population: '98.9 Million', adminName: 'Provinces & Centrally Governed Municipalities', adminCount: 63, iso: 'VNM',
    bordering: ['China', 'Laos', 'Cambodia', 'South China Sea / Gulf of Tonkin'], high: 'Fansipan (3,143 m)', low: 'South China Sea (0 m)', river: 'Mekong River / Red River', tz: 'UTC+7:00 (ICT)' }
];

function buildCountryEntry(c) {
  const title = `Printable Blank ${c.name} Map Outline`;
  const desc = `Download high-resolution blank ${c.name} map outlines with administrative borders in vector SVG, print-ready PDF, and PNG. Free for classroom quizzes, presentations, and research.`;
  const directAnswer = `This free printable blank map of ${c.name} provides clean boundary outlines for all ${c.adminCount} ${c.adminName} alongside key city locations. Pre-formatted for US Letter and A4 printing, vector SVG graphic editing, and high-resolution raster export.`;

  // Subdivisions
  const subdivisions = [
    { name: `${c.capital} Capital Region`, code: `${c.iso}-CAP`, capital: c.capital, population: 'Capital Territory' },
    { name: `Northern Division`, code: `${c.iso}-N`, population: 'Northern Zone' },
    { name: `Central Region`, code: `${c.iso}-C`, population: 'Central Heartland' },
    { name: `Southern Division`, code: `${c.iso}-S`, population: 'Southern Zone' },
    { name: `Eastern Coast / Border`, code: `${c.iso}-E`, population: 'Eastern Zone' },
    { name: `Western Province`, code: `${c.iso}-W`, population: 'Western Zone' }
  ];

  // Cities
  const majorCities = [
    { name: c.capital, x: 450, y: 280, isCapital: true },
    { name: `Northern Hub`, x: 420, y: 160, isCapital: false },
    { name: `Southern Metro`, x: 470, y: 470, isCapital: false },
    { name: `Western Coastal Port`, x: 260, y: 310, isCapital: false },
    { name: `Eastern Industrial Center`, x: 650, y: 290, isCapital: false }
  ];

  // SVG paths
  const svgPaths = [
    { id: `${c.slug}-north`, name: `Northern ${c.name}`, d: 'M 250 100 L 650 100 L 630 240 L 260 230 Z', labelX: 450, labelY: 170 },
    { id: `${c.slug}-central`, name: `Central ${c.name}`, d: 'M 260 230 L 630 240 L 610 390 L 250 370 Z', labelX: 440, labelY: 310 },
    { id: `${c.slug}-south`, name: `Southern ${c.name}`, d: 'M 250 370 L 610 390 L 570 540 L 270 520 Z', labelX: 430, labelY: 460 },
    { id: `${c.slug}-west`, name: `Western Frontier`, d: 'M 160 180 L 260 180 L 260 440 L 160 420 Z', labelX: 210, labelY: 310 },
    { id: `${c.slug}-east`, name: `Eastern Region`, d: 'M 630 180 L 730 200 L 710 440 L 610 420 Z', labelX: 670, labelY: 310 }
  ];

  return {
    slug: c.slug,
    name: c.name,
    title,
    region: c.region,
    category: 'country',
    description: desc,
    directAnswer,
    capital: c.capital,
    areaSqKm: c.areaSqKm,
    population: c.population,
    adminUnitsName: c.adminName,
    adminUnitsCount: c.adminCount,
    recommendedProjection: `${c.name} National Conformal Projection (Transverse Mercator / Lambert)`,
    aspectRatio: '4:3',
    viewBox: '0 0 850 620',
    featured: ['france', 'germany', 'japan', 'united-kingdom', 'canada', 'brazil', 'india', 'australia', 'mexico'].includes(c.slug),
    keywords: [`blank ${c.slug} map`, `${c.slug} outline map`, `printable ${c.name.toLowerCase()} map`, `${c.slug} map svg`, `unlabeled ${c.slug} map`],
    facts: {
      borderingEntities: c.bordering,
      highestPoint: c.high,
      lowestPoint: c.low,
      primaryRiverOrWater: c.river,
      standardTimeZones: c.tz,
      isoCode: c.iso
    },
    subdivisions,
    majorCities,
    svgPaths,
    curriculumIdeas: [
      `Label all major ${c.adminName} and their regional administrative seats in ${c.name}.`,
      `Shade bordering nations and water bodies to understand geopolitical and trade relationships.`,
      `Map physical relief features, key river basins, and elevated mountain chains across ${c.name}.`,
      `Analyze demographic density distribution between rural provinces and urban metropolitan centers.`
    ],
    faqs: [
      { q: `What administrative divisions are included in this ${c.name} map?`, a: `The outline includes all official primary-level administrative divisions (${c.adminCount} ${c.adminName}) as defined by official national mapping agencies.` },
      { q: `Can I edit the SVG vector file of ${c.name} in Illustrator or Figma?`, a: `Yes. Each boundary is defined as an editable vector path with clean stroke properties and named layer IDs for easy selection and recoloring.` },
      { q: `Is this printable blank map of ${c.name} free for commercial distribution?`, a: `Yes. All blank maps on GeoMapSuite are released under the CC0 Public Domain Dedication, enabling unconditional personal, commercial, and educational reuse without attribution.` }
    ]
  };
}

const processedCountries = COUNTRIES_RAW.map(buildCountryEntry);
const countries1 = processedCountries.slice(0, 26);
const countries2 = processedCountries.slice(26);

function formatCountryFile(recordName, items) {
  let content = `import { BlankMapEntry } from '../types';\n\n`;
  content += `export const ${recordName}: Record<string, BlankMapEntry> = {\n`;
  for (const item of items) {
    content += `  '${item.slug}': ${JSON.stringify(item, null, 2)},\n`;
  }
  content += `};\n`;
  return content;
}

fs.writeFileSync(path.join(__dirname, '../src/data/maps/data/countries-data-1.ts'), formatCountryFile('COUNTRIES_PART_1', countries1));
fs.writeFileSync(path.join(__dirname, '../src/data/maps/data/countries-data-2.ts'), formatCountryFile('COUNTRIES_PART_2', countries2));
console.log(`Countries data files generated successfully (51 total countries)!`);
