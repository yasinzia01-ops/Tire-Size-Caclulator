/** Homepage copy, taken verbatim from https://tiresizecalculator.pro/ (Sept 2026). */
import type { IconName } from './icons';

export const FEATURES = [
  { title: 'Poke & Inset', desc: 'Checks if wheels fit inside your arches', tone: 'red' },
  { title: 'Speedo Error', desc: 'Shows speedometer impact of size change', tone: 'navy' },
  { title: 'Visual Diagrams', desc: 'Side view & front view update live', tone: 'red' },
  { title: 'Ride Height', desc: 'Calculate suspension & arch gap change', tone: 'navy' },
] as const;

export const CAN_CALCULATE: { text: string; href?: string }[] = [
  { text: 'Tire diameter & circumference comparison' },
  { text: 'Wheel offset (ET) & poke / inset calculation', href: '/wheel-offset/' },
  { text: 'Speedometer error at 30mph & 60mph' },
  { text: 'Ride height & arch gap change in mm' },
  { text: 'Ideal rim width range for your tire' },
  { text: 'Side view & front view fitment diagrams' },
  { text: 'Works for cars, SUVs, trucks & vans' },
];

export const TRUST_TOP = ['Free tire size calculator', 'No sign-up required', 'Works for cars, SUVs & trucks', 'Instant results', 'Speedo error calculator included'];
export const TRUST_BOTTOM = ['Free tire size calculator', 'No sign-up or download', 'Works for all vehicle types', 'Speedo error calculator included', 'Mobile friendly'];

export const STEPS = [
  {
    title: 'Enter Wheel 1 (Your Current Setup)',
    desc: 'Input your existing wheel diameter (inches), width (inches), and ET/offset (mm). Then enter your current tire width (mm) and profile percentage. This is your baseline for comparison.',
  },
  {
    title: 'Enter Wheel 2 (Your New Size)',
    desc: 'Enter the specs for the new wheel and tire combination you want to fit. The calculator will compare it against Wheel 1, showing diameter difference, poke, inset change, and speedometer error.',
  },
  {
    title: 'Hit Calculate & Read Your Results',
    desc: 'Click Calculate to instantly see the side-view profile comparison, front-view offset/poke diagram, and a full metric table including speedo error at 30mph and 60mph.',
  },
];

export const TIRE_CODE_PARTS = [
  { code: 'P', title: 'Intended Use', desc: 'P = Passenger car. LT = Light Truck. ST = Special Trailer. T = Temporary (spare).' },
  { code: '215', title: 'Section Width (mm)', desc: "The tire's width from sidewall to sidewall in millimeters. This is the first number you enter in the tire size calculator." },
  { code: '65', title: 'Aspect Ratio / Profile %', desc: 'The sidewall height as a percentage of the section width. 65 means the sidewall is 65% of 215mm = 139.75mm tall.' },
  { code: 'R15', title: 'Construction & Rim Diameter', desc: 'R = Radial construction. 15 = the wheel/rim diameter in inches this tire fits.' },
  { code: '95H', title: 'Load Index & Speed Rating', desc: '95 = load index (690 kg max per tire). H = speed rating (up to 130 mph / 210 km/h).' },
];

export const GLOSSARY = [
  { term: 'ET / Offset', def: "Einpress Tiefe — the distance in mm between the wheel's mounting face and its geometric centre. Positive ET = mounting face closer to the outside; Negative ET = closer to the inside." },
  { term: 'Poke', def: 'How far the outer edge of the tire sticks out from the wheel arch (fender). Positive poke means the tire protrudes outward. Excessive poke can cause rubbing on bodywork.' },
  { term: 'Inset', def: 'How far the inner edge of the tire sits from the suspension/strut. Larger inset values risk fouling the suspension or brake components on the inner side.' },
  { term: 'Speedo Error', def: 'When you change tire size, your speedometer may read incorrectly because it measures wheel revolutions. A larger diameter tire covers more distance per revolution — the speedo reads low.' },
  { term: 'Aspect Ratio', def: "The ratio of a tire's sidewall height to its width, expressed as a percentage. A 205/45R17 tire has a sidewall height that is 45% of 205mm = 92.25mm." },
  { term: 'Rolling Radius', def: 'Half the overall loaded tire diameter. Affects speedo accuracy and gearing. Changing rolling radius by more than 3% from OEM spec can affect ABS, traction control, and odometer readings.' },
  { term: 'Plus Sizing', def: 'Fitting a larger diameter rim with a lower-profile tire to maintain the same overall diameter. E.g. moving from 205/55R16 to 225/45R17 — same diameter, sportier look, sharper handling.' },
  { term: 'Backspace', def: "The distance from the wheel's inner mounting flange to the back of the wheel. Related to offset but measured differently. Critical for ensuring clearance behind the wheel." },
  { term: 'Section Width', def: 'The total width of the mounted and inflated tire from outer sidewall to inner sidewall, in mm. The first number in a standard tire code (e.g. 205 in 205/55R16).' },
];

export const FITMENT: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'triangleRuler',
    // Live title was "iOS (Apple Books)" — an obvious CMS slip; see solution.md §10.
    title: 'What is Poke?',
    desc: 'Poke (outer clearance) is how far your tire sticks out beyond the fender/arch lip. A small positive poke (flush or slightly proud) is the target look for most builds. Too much poke risks rubbing the arch liner. Our tire fitment calculator shows poke in mm for each wheel setup.',
  },
  {
    icon: 'nutBolt',
    title: 'What is Inset?',
    desc: 'Inset (inner clearance) is the gap between the inner edge of your tire and the nearest suspension or brake component. Too little inset and your tires will foul the strut, caliper, or inner arch. Insufficient inset is a safety concern and cannot be fixed with spacers alone.',
  },
  {
    icon: 'warning',
    title: 'Avoiding Rubbing',
    desc: 'Rubbing happens when poke is too high (outer rub at arch) or inset is too low (inner rub at strut). Always check both values before buying new wheels. Low-profile tires rub less on bumps; wider tires are more susceptible. Our wheel and tire calculator flags these issues automatically.',
  },
];

export const SPEEDO_COPY = [
  'Changing your tire size directly affects your speedometer accuracy. Here’s how to calculate speedo error and what it means for your vehicle.',
  'Your speedometer works by counting the number of wheel revolutions per second and multiplying by the tire’s circumference to calculate speed. When you fit a larger-diameter tire, each revolution covers <strong>more distance</strong> your actual speed is higher than displayed. With a smaller tire, the opposite occurs.',
  'A tire size difference of just 3% from OEM spec can cause your speedo to read 2–3 mph off at 60 mph. This also affects your odometer, trip computer, and critically ABS and traction control calibration, as highlighted by <strong><a href="https://www.nhtsa.gov/vehicle-safety/tires" target="_blank" rel="noopener">NHTSA’s tire safety guidelines</a></strong>',
  '<strong>General rule:</strong> Taller tire = speedo reads LOW (you’re going faster than shown). Shorter tire = speedo reads HIGH (you’re going slower than shown).',
];

/** Size changes used for the "Speedo error at common tire size changes" table (all appear elsewhere on the site). */
export const COMMON_CHANGES: [string, string][] = [
  ['205/55R16', '215/55R16'],
  ['205/55R16', '225/45R17'],
  ['205/45R17', '225/40R18'],
  ['205/55R16', '225/50R17'],
  ['265/70R17', '285/75R17'],
];

export const USERS: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'wrench', title: 'Car Modifiers & Enthusiasts', desc: 'Check poke, inset, and clearance before ordering new aftermarket wheels. Avoid costly rubbing issues or return trips to the tyre shop.' },
  { icon: 'suv', title: 'Everyday Drivers', desc: 'Find an equivalent replacement tire size when your exact OEM size is unavailable — and check if the speedo error is within acceptable limits.' },
  { icon: 'raceCar', title: 'Track & Performance Drivers', desc: 'Calculate the effect of plus-sizing on overall diameter, rolling radius, and gearing — critical for maintaining accurate lap times and speedometer readings.' },
  { icon: 'pickup', title: 'Truck & SUV Owners', desc: 'Fitting larger off-road tires? Calculate speedo error, ride height change, and arch clearance before committing to an expensive lift kit and new rubber.' },
  { icon: 'hammerWrench', title: 'Mechanics & Tyre Fitters', desc: "Quickly verify that a customer's requested tire size is a safe and legal equivalent to their OEM spec — share results directly from the tool." },
  { icon: 'car', title: 'Used Car Buyers', desc: 'Check if a second-hand vehicle has non-standard wheels fitted that might be causing speedometer errors or tyre rubbing issues.' },
];

export const FAQ = [
  {
    q: 'What is a tire size calculator and what does it calculate?',
    a: '<p>A tire size calculator computes the overall tire diameter, circumference, sidewall height, poke (outer clearance), inset (inner clearance), speedometer error, and ride height change when you compare two different wheel and tire size combinations. Enter your current setup as Wheel 1 and your proposed new size as Wheel 2 to see a full side-by-side comparison.</p>',
  },
  {
    q: 'How much speedo error is acceptable when changing tire size?',
    a: '<p>Most automotive engineers consider ±3% speedo error to be acceptable for road use. Most automotive engineers and <strong><a href="https://www.sae.org/" target="_blank" rel="noopener">SAE International</a></strong> recommend keeping your tire diameter within 3% of OEM spec to avoid affecting ABS, traction control, and odometer accuracy., and a maximum of +10% + 4 km/h over is permitted by law. Beyond 3%, your ABS, traction control, and odometer may also be affected. Use the speedo error calculator above to check your specific size change.</p>',
  },
  {
    q: 'What is wheel offset (ET) and how does it affect fitment?',
    a: '<p>Wheel offset (ET from German Einpress Tiefe) is the distance in mm from the wheel’s mounting face to its geometric centre line. A higher ET pushes the wheel further into the arch (more inset, less poke). A lower ET pulls the wheel outward (more poke, less inset). Changing ET affects both inner and outer clearances simultaneously. Our wheel offset calculator shows the impact in mm.</p>',
  },
  {
    q: 'Can I fit a wider tire on my existing wheels?',
    a: '<p>Yes, within limits. As a general rule, you can go 10–20mm wider than the OEM tire width on the same rim. Going too wide causes “tyre stretch” the sidewall becomes more upright or even angled inward, reducing stability and risking bead unseating. Use our ideal rim range metric in the results to check compatibility. NHTSA recommends only fitting tires matching your OEM spec or a manufacturer-approved size <strong><a href="https://www.nhtsa.gov/vehicle-safety/tires#the-topic-buying" target="_blank" rel="noopener">NHTSA tire buying guide</a></strong></p>',
  },
  {
    q: 'What does "plus sizing" mean in tire sizes?',
    a: '<p>Plus sizing means fitting a larger rim diameter with a lower-profile tire, keeping the overall tire diameter the same as OEM. For example, upgrading from 205/55R16 to 225/45R17 is “plus one” sizing. The benefits include sportier appearance, improved lateral stiffness, and better handling. The trade-off is a harsher ride due to less sidewall cushioning.</p>',
  },
  {
    q: 'How do I read a tire size code like 205/55R16?',
    a: '<p>205 = section width in mm (sidewall to sidewall). 55 = aspect ratio — the sidewall height is 55% of 205mm = 112.75mm. R = radial construction. 16 = the rim diameter in inches the tire is designed to fit. You may also see a load index and speed rating after (e.g. 91V). Enter the three main numbers into our tire size calculator to get full dimensional data.</p>',
  },
  {
    q: 'Will changing tire size affect my fuel economy?',
    a: '<p>Yes. Wider and taller tires have higher rolling resistance, which slightly reduces fuel economy. A 3% increase in rolling radius typically causes a 1–2% reduction in mpg. However, the effect depends heavily on tire compound, inflation pressure, and driving style. The bigger practical concern for most drivers is speedo error and fitment clearance. Learn more at <strong><a href="https://www.fueleconomy.gov/feg/maintain.jsp" target="_blank" rel="noopener">FuelEconomy.gov</a></strong>.</p>',
  },
  {
    q: 'Does this wheel and tire calculator work for trucks and SUVs?',
    a: '<p>Yes — the calculator works for any vehicle. For trucks and SUVs, pay special attention to ride height change and speedo error, as larger off-road tires (e.g. 265/70R17 to 285/75R17) cause significant diameter changes. A 3-inch diameter increase causes roughly a 5% speedo error — you will need a speedo recalibration tool or ECU tune to correct it.</p>',
  },
];
