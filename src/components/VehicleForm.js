// src/components/VehicleForm.js - FINAL CLEAN CODE

import React, { useState, useMemo } from 'react';
import {
    FaCar,
    FaCamera,
    FaRulerHorizontal,
    FaTag,
    FaPaintBrush,
    FaSave,
    FaTimes,
    FaImage
} from 'react-icons/fa';

// ----------------------------------------------------------------------
// 1. DATA DEFINITIONS & SORTING
// ----------------------------------------------------------------------

const vehicleBodyTypes = [
    'car', 'bus',
    // --- Passenger Vehicles (P-segment) ---
    'Sedan (4-door)', 'Coupe (2-door)', 'Hatchback', 'Wagon (Station Wagon)', 'Convertible / Cabriolet', 'Roadster / Spyder (2-seat)', 'Microcar / City Car',
    // --- Utility & Crossovers (S-segment) ---
    'Crossover (CUV) - Compact', 'SUV (Sport Utility Vehicle) - Mid-size', 'SUV (Sport Utility Vehicle) - Full-size', 'Minivan / Multi-purpose Vehicle (MPV)',
    // --- Light/Medium Duty Trucks & Vans (T-segment) ---
    'Pickup Truck (Half-ton / Light Duty)', 'Pickup Truck (Three-quarter Ton)', 'Pickup Truck (One-ton / Heavy Duty)', 'Cargo Van / Panel Van', 'Passenger Van (12/15 seat)', 'Cutaway Van / Chassis Cab', 'Step Van / Delivery Van (Short/Long)', 'Small Bus / Shuttle Bus',
    // --- Heavy Duty Trucks (H-segment) ---
    'Tractor Truck (Semi) - Day Cab', 'Tractor Truck (Semi) - Sleeper Cab', 'Straight Truck (Box Truck)', 'Dump Truck (Single Axle)', 'Dump Truck (Tandem/Tri-Axle)', 'Flatbed Truck (Heavy Duty)', 'Roll-off Truck', 'Crane Truck', 'Tanker Truck (Fuel/Liquid)', 'Cement Mixer Truck', 'Garbage / Refuse Truck', 'Service / Utility Truck', 'Fire Truck / Emergency Vehicle', 'Tow Truck / Wrecker - Light Duty', 'Tow Truck / Wrecker - Heavy Duty',
    // --- Trailers (Separate Asset Management) ---
    'Box Trailer (Dry Van) - 53ft', 'Box Trailer (Dry Van) - 48ft', 'Reefer Trailer (Refrigerated)', 'Flatbed Trailer (Standard)', 'Step Deck Trailer', 'Lowboy Trailer / Detachable Gooseneck (RGN)', 'Tank Trailer (Liquid/Gas)', 'Hopper Trailer (Grain/Powder)', 'Livestock Trailer', 'Car Hauler Trailer (Open)', 'Car Hauler Trailer (Enclosed)', 'Utility Trailer (Small)', 'Equipment Trailer (Gooseneck)', 'Specialized Trailer (Oil Field, Logging, etc.)',
    // --- Heavy Equipment & Industrial (I-segment) ---
    'Excavator (Standard)', 'Mini Excavator', 'Skid Steer / Compact Loader', 'Backhoe Loader', 'Wheel Loader', 'Forklift (Warehouse)', 'Telehandler / Boom Lift', 'Scissor Lift / Aerial Platform', 'Dozer / Bulldozer', 'Grader / Motor Grader', 'Roller / Compactor', 'Agricultural / Farm Tractor', 'Combine Harvester',
    // --- Specialty & Recreational (R-segment) ---
    'Motorcycle / Scooter', 'ATV / Quad', 'UTV / Side-by-Side', 'RV / Motorhome (Class A)', 'RV / Motorhome (Class B/C)', 'Travel Trailer / Fifth Wheel', 'Snowmobile', 'Boat / Marine Vessel (Inboard/Outboard)', 'Golf Cart / Utility Cart',
    // --- Default/Catch-all ---
    'Other / Unknown Equipment', 'Chassis Only'
].sort((a, b) => a.localeCompare(b));

const rawMakeModelData = {
    // Passenger/Luxury Makes
    'Acura': ['MDX', 'RDX', 'TLX', 'Integra', 'NSX'].sort(),
    // 🚀 UPDATED: Complete List of Audi Models
    'Audi': [
        '5+5', '50', '60', '72', '80', '90', '100', '100 Coupé S', '200', '500', '920', '4000', '5000',
        'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A6 allroad quattro', 'A6 e-tron', 'A7', 'A8', 'allroad quattro',
        'Cabriolet', 'Coupé',
        'e-tron GT', 'E5',
        'F103', 'Fox', 'Front',
        'Lunar Quattro',
        'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q5 e-tron', 'Q6', 'Q6 e-tron', 'Q7', 'Q8', 'Q8 e-tron', 'Quattro', 'Quattro S1',
        'R8', 'R8 (Type 4S)', 'R8 (Type 42)',
        'RS 2 Avant', 'RS3', 'RS3 Sportback', 'RS 4', 'RS4', 'RS5', 'RS 6', 'RS6', 'RS7',
        'S2', 'S3', 'S4', 'S4 25quattro', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'SQ8',
        'TT', 'TT RS', 'TTS', 'Type A', 'Type B', 'Type C', 'Type D', 'Type E', 'Type G', 'Type K', 'Type M', 'Type P', 'Type R', 'Type SS', 'Type T',
        'V8'
    ].sort(),
    'Bentley': ['Continental GT', 'Flying Spur', 'Bentayga'].sort(),
    // 🚀 UPDATED: Complete List of BMW Models
    'BMW': [
        '1 Series (E87)', '1 Series (F20)', '1 Series (F40)', '1 Series (F52)', '1 Series (F70)', '1M', '02 Series',
        '2 Series (G42)', '2 Series Gran Coupé', '2 Series (F22)', '2 Series Active Tourer', '2.6', '3/15', '3/20',
        '3 Series (E21)', '3 Series (E30)', '3 Series (E36)', '3 Series (E46)', '3 Series (E90)', '3 Series (F30)',
        '3 Series (G20)', '3 Series Compact', '3.0S', '3.0Si', '3.3L', '4 Series (F32)', '4 Series (G22)',
        '5 Series (E34)', '5 Series (E39)', '5 Series (E60)', '5 Series (F10)', '5 Series (E12)', '5 Series (E28)',
        '5 Series (G30)', '5 Series (G60)', '6 Series (E63)', '6 Series (E24)', '6 Series (F12)', '6 Series (G32)',
        '7 Series (E32)', '7 Series (E23)', '7 Series (E38)', '7 Series (E65)', '7 Series (F01)', '7 Series (G11)',
        '7 Series (G70)', '8 Series (E31)', '8 Series (G15)', '303', '316i', '318i', '320', '320i', '321', '323i',
        '325e', '326', '327', '328', '329', '335', '340', '501', '502', '503', '507', '525e', '600', '700', '1500',
        '1502', '1600', '1600 GT', '1600-2', '1602', '1800', '1802', '2000', '2000 Touring', '2002', '2500', '2600',
        '2800', '3200 CS', '3 Series (G50)', 'i3 (NA0)', 'iX4', 'X3 (G45)', 'Dixi', 'E9', 'F 76', 'H2R',
        'Hydrogen 7', 'i3', 'i4', 'i7', 'i8', 'iX', 'L7', 'M Coupé and Roadster', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6',
        'M8', 'New Class', 'New Six', 'Osella PA2', 'Osella PA20', 'Skytop', 'V12 LMR', 'V12 LM', 'X1', 'X1 (E84)',
        'X1 (F48)', 'X1 (U11)', 'X2', 'X3', 'X4', 'X5', 'X5 (E53)', 'X5 (E70)', 'X5 (F15)', 'X5 (F85)', 'X5 (G05)',
        'X6', 'X7', 'XM', 'Z1', 'Z3', 'Z4 (E85)', 'Z4 (E89)', 'Z4 (G29)', 'Z8'
    ].sort(),
    'Buick': ['Encore', 'Enclave', 'Regal'].sort(),
    'Cadillac': ['Escalade', 'CT5', 'XT5', 'Lyriq'].sort(),
    'Chevrolet': ['Malibu', 'Corvette', 'Silverado 1500', 'Tahoe', 'Equinox', 'Camaro'].sort(),
    'Chrysler': ['300', 'Pacifica'].sort(),
    'Dodge': ['Challenger', 'Charger', 'Durango', 'Ram 1500 Classic (Ram Truck)'].sort(),
    'Fiat': ['500', 'Panda'].sort(),
    'Ford': ['Ford Ranger','F-150', 'Mustang', 'Explorer', 'Escape', 'Focus', 'Transit Van'].sort(),
    'GMC': ['Sierra 1500', 'Yukon', 'Acadia', 'Canyon'].sort(),
    'Honda': ['CR-V', 'Civic', 'Accord', 'Pilot', 'Odyssey', 'Ridgeline'].sort(),
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Palisade', 'Kona'].sort(),
    'Infiniti': ['Q50', 'QX60', 'QX80'].sort(),
    'Jaguar': ['F-PACE', 'I-PACE', 'XF'].sort(),
    'Jeep': ['Wrangler', 'Grand Cherokee', 'Gladiator', 'Renegade'].sort(),
    'KIA': ['Telluride', 'Sorento', 'K5', 'Forte', 'EV6'].sort(),
    'Lamborghini': ['Huracán', 'Aventador', 'Urus'].sort(),
    // 🇬🇧 Range Rover/Land Rover Models
    'Land Rover': [
        '1/2 ton Lightweight', '101 Forward Control', 'DC100', 'Defender', 'Discovery', 'Discovery 3',
        'Discovery 4', 'Discovery Sport', 'Discovery Series I', 'Discovery Series II', 'Freelander',
        'Llama', 'Long Range Patrol Vehicle', 'LR3', 'LR4', 'Perentie', 'Range Rover',
        'Range Rover Classic', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar',
        'Ranger Special Operations Vehicle', 'Series II', 'Series IIa', 'Series III', 'Wolf',
        // Platform/internal code references (kept for common recognition)
        'Discovery (L462)', 'Discovery Sport (L550)', 'Defender (L663)', 'Range Rover (L322)',
        'Range Rover (L405)', 'Range Rover (L460)', 'Range Rover (P38A)', 'Range Rover Evoque (L538)',
        'Range Rover Evoque (L551)', 'Range Rover Sport (L320)', 'Range Rover Sport (L494)',
    ].sort(),
    'Lexus': ['RX', 'GX', 'IS', 'LS', 'NX'].sort(),
    'Lincoln': ['Navigator', 'Aviator', 'Corsair'].sort(),
    'Maserati': ['Ghibli', 'Levante', 'MC20'].sort(),
    // 🇯🇵 NEW/UPDATED: Comprehensive Mazda Models
    'Mazda': [
        '2', '3', '5', '6', '8', '121', '616', '618', '626', '800', '808', '818', '929', '1000', '1200',
        '1300', '1500', '1800', '2000', 'Allegro', 'Artis', 'Astina', 'Atenza', 'Axela', 'AZ-3', 'AZ-550',
        'AZ-Offroad', 'AZ-Wagon', 'B series', 'B360', 'B600', 'Biante', 'Bongo', 'Bravo', 'BT-50', 'Capella',
        'Carol', 'Chantez', 'Cosmo', 'CX-3', 'CX-4', 'CX-5', 'CX-7', 'CX-8', 'CX-9', 'CX-30', 'CX-50',
        'CX-60', 'CX-80', 'CX-90', 'Demio', 'E-Series', 'Étude', 'EZ-6', 'EZ-60', 'Familia', 'Familia Van',
        'Flair', 'Flair Crossover', 'Flair Wagon', 'GLC', 'Grand Familia', 'Isamu Genki', 'K360', 'Lantis',
        'Laputa', 'Luce', 'Metro', 'Miata', 'Millenia', 'Mizer', 'Montrose', 'MPV', 'MX-3', 'MX-5',
        'MX-6', 'MX-30', 'Navajo', 'P360', 'Parkway', 'Persona', 'Porter', 'Precedia', 'Premacy', 'Proceed',
        'Proceed Levante', 'Proceed Marvie', 'Protegé', 'R100', 'R130', 'R360', 'Revue', 'Roadpacer', 'Roadster',
        'Rustler', 'RX-2', 'RX-3', 'RX-4', 'RX-5', 'RX-7', 'RX-8', 'RX-9', 'Savanna', 'Scrum', 'Sentia',
        'Spiano', 'Titan', 'Traveller', 'Tribute', 'Verisa', 'VX-1', 'Xedos', 'Xedos 6', 'Xedos 9',
        // Internal/Less Common Entries (kept for completeness)
        '6 (third generation)', 'CX', 'Mazda-Go', 'Navajo (SUV)', 'Premacy Hydrogen RE Hybrid', 'RX-8 Hydrogen RE',
        'Suitcase Car', 'Pathfinder XV-1', 'Autozam Scrum', 'Sao Penza', 'RE Amemiya',
    ].sort(),
    'McLaren': ['720S', 'Artura', 'GT'].sort(),
    // 🚀 NEW/UPDATED: Comprehensive Mercedes-Benz Models
    'Mercedes-Benz': [
        '35 hp', '60hp', '130', '170S', '180', '180E', '190', '190 SL', '200', '200T', '219', '220', '230', '230 TE',
        '250', '260 D', '280', '300', '300 SEL 6.3', '300 SL', '300 SLR', '300D', '320', '320A', '350', '380',
        '380 (1933)', '380SEL', '400', '420', '430', '450', '450SEL 6.9', '500', '500 E', '500 SL', '500K', '540K',
        '560', '600', '770', 'A-Class', 'B-Class', 'C-Class', 'Citan', 'CL-Class', 'CLA', 'CLC-Class', 'CLE',
        'CLK GTR', 'CLK-Class', 'CLS', 'E-Class', 'EQA', 'EQB', 'EQC', 'EQE', 'EQE SUV', 'EQS', 'EQS SUV',
        'F-Cell', 'Fintail', 'G-Class', 'G500 4x4²', 'GL-Class', 'GLA', 'GLB', 'GLC',
        'GLC with EQ technology', 'GLE', 'GLK-Class', 'GLS', 'M-Class', 'MB100', 'Metris', 'N1300',
        'Ponton', 'R-Class', 'SL (R232)', 'SL-Class', 'SLC-Class', 'SLK-Class', 'SLR McLaren', 'SLS AMG',
        'SSK', 'Unimog', 'Valente', 'Vaneo', 'Viano', 'VLE',
        // AMG Models
        'AMG G 63 6x6', 'AMG GT', 'AMG GT 4-Door Coupé', 'AMG One', 'SLS AMG Electric Drive',
        // Chassis/Nomenclature References (kept for common recognition)
        'Benz Velo', 'CLK LM', 'L 319', 'L 337', 'L3000', 'Lotec C1000', 'MB-trac', 'Mellor Strata',
        'Simplex', 'Unimog 404', 'Unimog 405', 'Unimog 406', 'Unimog 419', 'Unimog 425', 'Unimog 435',
        'Unimog 437',
    ].sort(),
    'Mini': ['Cooper', 'Countryman'].sort(),
    'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage'].sort(),
    // 🚀 UPDATED: Comprehensive Nissan Models
    'Nissan': [
        '100NX', '180SX', '200SX', '240SX', '260Z', '300C', '300ZX', '350Z', '370Z', '1400', 'AD', 'Almera',
        'Almera Tino', 'Altima', 'Altra', 'Aprio', 'Ariya', 'Armada', 'Auster', 'Avenir', 'Axxess', 'Bassara',
        'Be-1', 'Bluebird', 'Bluebird (U14)', 'Bluebird Sylphy', 'Cabstar', 'Caravan', 'Cedric', 'Cefiro',
        'Cherry', 'Cima', 'Clipper', 'Crew', 'Cube', 'Dayz', 'Dayz Roox', 'Dongfeng Z9', 'Dualis', 'Elgrand',
        'EXA', 'Expert', 'Fairlady Z', 'Fairlady Z (S130)', 'Figaro', 'Frontier', 'Frontier (North America)',
        'Frontier Pro', 'Fuga', 'Gazelle', 'Gloria', 'GT-R', 'Hardbody', 'Homy', 'Hypermini', 'Impendulo',
        'Interstar', 'Jonga', 'Juke', 'Junior', 'Kicks', 'King Van', 'Kix', 'Kubistar', 'Lafesta', 'Lambda 4S',
        'Langely EXA', 'Langley', 'Lannia', 'Latio', 'Laurel', 'Leaf', 'Leaf (first generation)', 'Leopard',
        'Livina', 'Lucino', 'Magnite', 'Maxima', 'March', 'Micra', 'Mistral', 'Moco', 'Multi', 'Murano', 'N6',
        'N7', 'Navara', 'Nomad', 'Note', 'NP200', 'NP300', 'NV (North America)', 'NV200', 'NV250', 'NV400',
        'NX', 'Otti', 'Pao', 'Pathfinder', 'Patrol', 'Pino', 'Pintara', 'Pixo', 'Platina', 'Prairie', 'Presage',
        'Presea', 'President', 'Primastar', 'Primera', 'Prince Royal', 'Pulsar', 'Pulsar EXA', 'Pulsar NX',
        'Qashqai', 'Qashqai (first generation)', 'Quest', 'QX', 'R\'nessa', 'Rasheen', 'Rogue', 'Rogue Sport',
        'Roox', 'S-Cargo', 'Safari', 'Sakura', 'Santana', 'Sentra', 'Seranza', 'Serena', 'Sileighty', 'Silvia',
        'Skyline', 'Skyline Crossover', 'Skyline GT-R', 'Stagea', 'Stanza', 'Sunny', 'Sylphy', 'Teana', 'Tekton',
        'Terra', 'Terrano II', 'Tiida', 'Titan', 'Townstar', 'Trade', 'Tsuru', 'Urvan', 'Ute', 'Vanette',
        'Versa', 'Violet', 'X-Trail', 'Xterra', 'Z (RZ34)', 'Z-car'
    ].sort(),
    'Porsche': ['911', 'Cayenne', 'Macan', 'Taycan'].sort(),
    'Rolls-Royce': ['Phantom', 'Ghost', 'Cullinan'].sort(),
    'Scion': ['tC', 'xB', 'FR-S'].sort(),
    'Smart': ['ForTwo', 'ForFour'].sort(),
    // 🇯🇵 NEW/UPDATED: Comprehensive Subaru Models
    'Subaru': [
        '360', '450', '1000', '1500', '1600', 'Alcyone', 'Ascent', 'B9sc', 'Baja', 'Bighorn', 'BRAT', 'Brumby',
        'BRZ', 'Chiffon', 'Crosstrek', 'Dex', 'Elaion', 'Evoltis', 'Exiga', 'FF-1 Star', 'Fiori', 'Forester',
        'G', 'G3X Justy', 'Impreza', 'Impreza WRC', 'Impreza WRX STI', 'Justy', 'Legacy', 'Legacy RS', 'Leone',
        'Levorg', 'Liberty', 'Liberty Exiga', 'Loyale', 'Lucra', 'Mini Jumbo', 'Outback', 'Outback Sport',
        'Pleo', 'Pleo Plus', 'R-2', 'R1', 'R1e', 'R2', 'Rex', 'Sambar', 'Sherpa', 'Shifter', 'Solterra',
        'Stella', 'Sumo', 'SVX', 'Trailseeker', 'Traviq', 'Trezia', 'Tribeca', 'Uncharted', 'Vivio', 'Vortex',
        'WRX', 'WRX STI', 'WRX GT', 'WRX Sportswagon', 'XT', 'XV',
        // Platform/internal code references (kept for common recognition)
        'BRZ (ZN8)', 'BRZ Concept STI', 'Impreza (second generation)',
        'Legacy (first generation)', 'Legacy (second generation)', 'Legacy (third generation)',
        'Legacy (fourth generation)', 'Legacy (fifth generation)', 'Legacy (sixth generation)',
        'Legacy (seventh generation)',
    ].sort(),
    // ✅ UPDATED TOYOTA LIST
    'Toyota': [
        '1000', '2000GT', '4Runner', '700', '86', '86 Hakone', 'A1', 'AA', 'AB', 'AC', 'AE', 'AE85', 'AE86',
        'Agya', 'Agya (B100)', 'AK', 'AK10', 'Allex', 'Allion', 'Alphard', 'Altezza', 'Altezza Gita',
        'Aqua', 'Aristo', 'Aurion', 'Auris', 'Avalon', 'Avanza', 'Avensis', 'Avensis Verso', 'Aygo', 'Aygo X',
        'BA', 'bB', 'Belta', 'BJ', 'Blade', 'Blizzard', 'Brevis', 'Briska',
        'bZ', 'bZ3', 'bZ3X', 'bZ4X', 'bZ4X Touring', 'bZ5', 'bZ7',
        'C-HR', 'C-HR+', 'C+pod', 'Caldina', 'Calya', 'Cami', 'Camry', 'Camry Solara', 'Carina', 'Carina E',
        'Carina ED', 'Carina II', 'Cavalier', 'Celica', 'Celica GT-Four', 'Celica Supra', 'Celica XX', 'Celsior',
        'Century', 'Chaser', 'Classic', 'Coaster', 'Comfort', 'COMS', 'Condor', 'Copen GR Sport', 'Corolla',
        'Corona', 'Corona EXiV', 'Corona Mark II', 'Corsa', 'Cressida', 'Cresta', 'Crown', 'Crown Eight',
        'Crown Kluger', 'Crown Majesta', 'Crown Vellfire', 'Crown-Athlete', 'Crown-Royal saloon', 'Curren', 'Cynos',
        'DA bus', 'DB bus', 'Duet', 'EA', 'EB', 'Echo', 'Engine', 'Esquire', 'Etios',
        'FC Bus', 'FCHV-BUS', 'FJ Cruiser', 'Fortuner', 'Frontlander', 'FunCargo', 'G Sports', 'Gaia',
        'Glanza', 'GR GT3', 'GR Supra', 'GR Yaris', 'GR86', 'GranAce', 'Grand HiAce', 'Grand Highlander', 'Granvia',
        'GT86', 'GY', 'Harrier', 'HB', 'HiAce', 'Highlander', 'Hilux', 'Hilux Champ', 'Hilux Surf', 'Hilux SW4',
        'HiMedic', 'Innova', 'Ipsum', 'iQ', 'Isis', 'IST', 'Ist', 'IZOA', 'JPN Taxi', 'Kijang',
        'Kijang Innova', 'Kluger', 'LB', 'Lexcen', 'Limo', 'Lingshang', 'Lite Stout', 'LiteAce', 'Liteace Noah',
        'Majesty', 'Mark II', 'Mark II Blit', 'Mark II Qualis', 'Mark X', 'Mark X ZiO', 'Master', 'MasterAce',
        'Master Line', 'Masterline', 'Matrix', 'Mega Cruiser', 'MiniAce', 'Mirai', 'Model F', 'MR-S', 'MR2',
        'Nadia', 'NAV1', 'Noah', 'Opa', 'Origin', 'Paseo', 'Passo', 'Passo Sette', 'Pixis', 'Pixis Epoch',
        'Pixis Joy', 'Pixis Mega', 'Pixis Space', 'Pixis Truck', 'Pixis Van', 'Platz', 'Porte', 'Prado', 'Premio',
        'Previa', 'Prius', 'Prius C', 'Prius Plug-in Hybrid', 'Prius Prime', 'Prius V', 'ProAce', 'Probox',
        'Progrès', 'Pronard', 'Publica', 'Qualis', 'Quantum', 'QuickDelivery', 'Ractis', 'Raize', 'Raum',
        'RAV-4 J', 'RAV-4 L', 'RAV4', 'RAV4 EV', 'Regius', 'RegiusAce', 'Rumion', 'Runx', 'Rush', 'Sienna',
        'Spacio', 'Tacoma', 'Tundra', 'VITZ', 'Wish', 'Yaris',
        // Note: Citroën Berlingo and Toyopet Master are kept outside the primary list for sorting clarity.
        'Citroën Berlingo', 'Toyopet Master'
    ].sort(),
    'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf'].sort(),
    'Volvo': ['S60', 'XC90', 'V60', 'VNL Truck'].sort(),

    // Commercial/Trailer Makes
    '321-TRAILERS': ['Flatbed 20ft', 'Dry Van 40ft', 'Gooseneck 30ft', 'Dump Trailer'].sort(),
    'Freightliner': ['Cascadia', 'M2', '114SD', 'Columbia'].sort(),
    'Peterbilt': ['379', '389', '579', '567'].sort(),
    'Kenworth': ['T680', 'W900', 'T880'].sort(),
    'International': ['LoneStar', 'LT Series', 'MV Series'].sort(),
    'Mack': ['Anthem', 'Granite', 'Pinnacle'].sort(),
    'Hino': ['338', '268'].sort(),
    'Utility Trailer': ['4000D-X', '3000R Reefer'].sort(),
    'Wabash': ['Duraplate', 'Arcticlite Reefer'].sort(),

    // Equipment Makes
    'Caterpillar': ['D5 Dozer', '320 Excavator', '950 Wheel Loader'].sort(),
    'John Deere': ['5075E Tractor', '333G Skid Steer'].sort(),
    'Genie': ['Z-45 Boom Lift', 'GS-2646 Scissor Lift'].sort(),
};

const makeModelData = rawMakeModelData;
const vehicleMakes = Object.keys(makeModelData).sort();
const transmissionOptions = [
    'Manual Transmission - MT',
    'Automatic Transmission - AT', // Updated from ATM
    'Automated Manual Transmission - AMT',
    'Continuously Variable Transmission - CVT'
].sort();

// 🚀 UPDATED: Comprehensive Engine Options
const engineOptions = [
    // Fuel Type & Hybrid
    'Gasoline (Petrol)',
    'Diesel',
    'Flex Fuel (E85/Gas)',
    'Electric (EV)',
    'Hybrid (HEV)',
    'Plug-in Hybrid (PHEV)',
    'Other Fuel (CNG/LPG/Hydrogen)',

    // Cylinder Count / Configuration
    '4-Cylinder Inline',
    '6-Cylinder Inline',
    '6-Cylinder V-Type (V6)',
    '8-Cylinder V-Type (V8)',
    '10-Cylinder V-Type (V10)',
    '12-Cylinder V-Type (V12)',
    '3-Cylinder Inline',
    'Rotary Engine (Wankel)',

    // Aspiration (For forced induction notes)
    'Naturally Aspirated (NA)',
    'Turbocharged',
    'Supercharged',
    'Twin-Turbo / Bi-Turbo'
].sort();


// Mock trim options (can be expanded later if trim becomes model-dependent)
const mockTrimOptions = [
    'Base',
    'Sport (S)',
    'Luxury (L)',
    'Grand Touring (GT)',
    'Limited',
    'Platinum / Denali',
    'XLT / LT',
    'Lariat / SLE',
    'Off-Road (TRD / Rubicon)'
].sort();

// ----------------------------------------------------------------------
// 2. REACT COMPONENT
// ----------------------------------------------------------------------

const VehicleForm = ({ onSave, onCancel }) => {
    // State to hold the selected image file URL
    const [vehicleImage, setVehicleImage] = useState(null);

    // --- State to hold form values ---
    const [formData, setFormData] = useState({
        vin: '',
        licensePlate: '',
        vehicleType: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        transmission: '',
        drivetrain: '',
        engine: '', // This value now uses the new comprehensive options
        odoReading: '',
        odoUnit: 'miles',
        color: '',
        unitNumber: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 🌟 LOGIC: If Make or Model changes, reset subsequent fields (Model/Trim)
        if (name === 'make') {
            setFormData(prev => ({
                ...prev,
                make: value,
                model: '',
                trim: ''
            }));
        }
        else if (name === 'model') {
            setFormData(prev => ({
                ...prev,
                model: value,
                trim: ''
            }));
        }
        // 🌟 LOGIC: If Year changes, keep the value, but reset Make/Model/Trim if Year is cleared
        else if (name === 'year') {
             setFormData(prev => ({
                ...prev,
                year: value,
                // Only reset if the new value is empty
                ...(value === '' && { make: '', model: '', trim: '' })
            }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 1. Handles the focus event on the 'Make' field (Requires Year)
    const handleMakeFocus = (e) => {
        if (!formData.year) {
            e.preventDefault();
            alert("Please select the Vehicle Year first before choosing the Make/Brand.");
            document.getElementById('year').focus();
        }
    };

    // 2. Handles the focus event on the 'Trim' field (Requires Model)
    const handleTrimFocus = (e) => {
        if (!formData.model) {
            e.preventDefault();
            alert("Please select the Vehicle Model first before choosing the Trim Option.");
            document.getElementById('model').focus();
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData, image: vehicleImage };
        // Basic validation for required fields
        if (!formData.year || !formData.make || !formData.model) {
            alert("Please complete the Year, Make, and Model fields.");
            return;
        }
        onSave(dataToSave);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setVehicleImage(imageUrl);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('vehicle-image-upload').click();
    };

    // Generating years from 2050 down to 1980
    const mockYears = useMemo(() => {
        const startYear = 2050;
        const endYear = 1980;
        const years = [];
        for (let i = startYear; i >= endYear; i--) {
            years.push(i);
        }
        return years;
    }, []);

    // 🌟 COMPUTED: Get the list of models based on the currently selected make
    const currentModels = useMemo(() => {
        const selectedMake = formData.make;
        return makeModelData[selectedMake] || [];
    }, [formData.make]);


    // --- Custom Image Placeholder/Preview ---
    const ImagePreview = () => {
        if (vehicleImage) {
            return (
                <div className="image-preview-wrapper" style={{ backgroundImage: `url(${vehicleImage})` }}>
                    {/* Image preview will show here */}
                </div>
            );
        }
        return (
            <div className="image-placeholder" onClick={triggerFileInput} title="Upload Vehicle Image">
                {/* Placeholder content is applied via CSS */}
            </div>
        );
    };
    // ----------------------------------------


    return (
        <div className="vehicle-form-container">
            <header className="page-header vehicle-header">
                <h2><FaCar /> New Vehicle</h2>
            </header>

            <form onSubmit={handleSubmit} className="form-card full-page-form vehicle-form">

                {/* HIDDEN FILE INPUT */}
                <input
                    type="file"
                    id="vehicle-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />

                {/* Image & Label Section (Top Bar) */}
                <div className="vehicle-header-actions">

                    {/* Image Preview / Placeholder Component */}
                    <ImagePreview />

                    <button type="button" onClick={() => alert("Add Label function not yet implemented")} className="btn-secondary-action small-btn">
                        <FaTag /> Add Label
                    </button>

                    <button type="button" className="btn-primary-action small-btn" onClick={triggerFileInput}>
                        <FaImage /> Upload Image
                    </button>

                    {/* Secondary Action Icons */}
                    <div className="icon-group">
                        <FaCamera className="icon-btn-form" title="Take Photo (Future feature)" />
                        <FaRulerHorizontal className="icon-btn-form" title="Measure" />
                    </div>
                </div>

                {/* 1. Primary Identifiers */}
                <h4 className="form-section-title"><FaCar /> Vehicle Details</h4>
                <div className="form-grid-1">
                    <div className="form-group">
                        <label htmlFor="vin">VIN / Serial Number</label>
                        <input type="text" id="vin" name="vin" placeholder="ENTER VIN OR SN" onChange={handleChange} value={formData.vin} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="licensePlate">License Plate</label>
                        <input type="text" id="licensePlate" name="licensePlate" placeholder="STATE & PLATE NUMBER EG: GAETNB642" onChange={handleChange} value={formData.licensePlate} />
                    </div>
                </div>

                {/* 2. Vehicle Specifications (3-column layout) */}
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="vehicleType">Vehicle Type</label>
                        <select id="vehicleType" name="vehicleType" onChange={handleChange} value={formData.vehicleType}>
                            <option value="">select vehicle type</option>
                            {/* Dynamically generated list (SORTED) */}
                            {vehicleBodyTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select id="year" name="year" onChange={handleChange} value={formData.year}>
                            <option value="">select vehicle year</option>
                            {/* Dynamically generated mock year list (Naturally sorted descending) */}
                            {mockYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* MAKE/BRAND SELECT: Controlled by Year selection */}
                    <div className="form-group">
                        <label htmlFor="make">Make/Brand</label>
                        <select
                            id="make"
                            name="make"
                            onChange={handleChange}
                            value={formData.make}
                            disabled={!formData.year && formData.make === ''}
                            onFocus={handleMakeFocus}
                        >
                            <option
                                value=""
                                style={!formData.year ? { color: 'red', fontWeight: 'bold' } : {}}
                            >
                                {formData.year ? 'select vehicle make' : 'Please! Choose "Year" first'}
                            </option>
                            {/* Dynamically generated list of vehicle makes (SORTED) */}
                            {vehicleMakes.map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="model">Model</label>
                        <select
                            id="model"
                            name="model"
                            onChange={handleChange}
                            value={formData.model}
                            disabled={!formData.make}
                        >
                            <option
                                value=""
                                style={!formData.make ? { color: 'red', fontWeight: 'bold' } : {}}
                            >
                                {formData.make ? 'select vehicle model' : 'Please! Choose "Make option" first'}
                            </option>
                            {/* 🌟 DYNAMIC LIST: Filtered Models (ALREADY SORTED) */}
                            {currentModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>

                    {/* TRIM OPTION SELECT: Controlled by Model selection */}
                    <div className="form-group">
                        <label htmlFor="trim">Trim Option</label>
                        <select
                            id="trim"
                            name="trim"
                            onChange={handleChange}
                            value={formData.trim}
                            disabled={!formData.model}
                            onFocus={handleTrimFocus}
                        >
                            <option
                                value=""
                                style={!formData.model ? { color: 'red', fontWeight: 'bold' } : {}}
                            >
                                {formData.model ? 'select vehicle trim' : 'Please! Choose "Model" first'}
                            </option>
                            {/* Mock trim options added */}
                            {mockTrimOptions.map(trim => (
                                <option key={trim} value={trim}>{trim}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="transmission">Transmission Type</label>
                        <select id="transmission" name="transmission" onChange={handleChange} value={formData.transmission}>
                            <option value="">select vehicle transmission</option>
                            {/* Dynamically generated list (SORTED) */}
                            {transmissionOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 3. Powertrain & Odometer */}
                <h4 className="form-section-title"><FaPaintBrush /> Color & Powertrain</h4>
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="color">Exterior Color</label>
                        <input type="text" id="color" name="color" placeholder="EG: BLACK, WHITE, ETC." onChange={handleChange} value={formData.color} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="engine">Engine Type / Configuration</label>
                        <select id="engine" name="engine" onChange={handleChange} value={formData.engine}>
                            <option value="">select engine type</option>
                            {/* Dynamically generated list (SORTED) */}
                            {engineOptions.map(eng => (
                                <option key={eng} value={eng}>{eng}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="drivetrain">Drive Train</label>
                        <select id="drivetrain" name="drivetrain" onChange={handleChange} value={formData.drivetrain}>
                            <option value="">select drive train</option>
                            <option value="Front-Wheel Drive (FWD)">Front-Wheel Drive (FWD)</option>
                            <option value="Rear-Wheel Drive (RWD)">Rear-Wheel Drive (RWD)</option>
                            <option value="All-Wheel Drive (AWD)">All-Wheel Drive (AWD)</option>
                            <option value="Four-Wheel Drive (4WD/4x4)">Four-Wheel Drive (4WD/4x4)</option>
                            <option value="6x4">Six Wheel Drive (6x4)</option>
                            <option value="6x2">Six Wheel Drive (6x2)</option>
                        </select>
                    </div>
                </div>

                {/* 4. Odometer/Internal */}
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="odoReading">Odometer Reading</label>
                        <input type="number" id="odoReading" name="odoReading" placeholder="ENTER CURRENT READING" onChange={handleChange} value={formData.odoReading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="odoUnit">Odometer Unit</label>
                        <select id="odoUnit" name="odoUnit" onChange={handleChange} value={formData.odoUnit}>
                            <option value="miles">Miles</option>
                            <option value="km">Kilometers (km)</option>
                            <option value="hours">Hours (for equipment)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitNumber">Unit Number (Internal)</label>
                        <input type="text" id="unitNumber" name="unitNumber" placeholder="YOUR FLEET ID (OPTIONAL)" onChange={handleChange} value={formData.unitNumber} />
                    </div>
                </div>


                {/* 5. Notes */}
                <h4 className="form-section-title">Notes</h4>
                <div className="form-group full-width">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        placeholder="Add any relevant history, condition details, or internal remarks about the vehicle."
                        onChange={handleChange}
                        value={formData.notes}
                    ></textarea>
                </div>


                {/* 6. Action Buttons (Sticky Footer/Bar) */}
                <footer className="form-actions-footer">
                    <button type="submit" className="btn-primary"><FaSave /> Save Vehicle</button>
                    <button type="button" onClick={onCancel} className="btn-cancel"><FaTimes /> Cancel</button>
                </footer>

            </form>
            {/* End of form */}
        </div>
    );
};

export default VehicleForm;