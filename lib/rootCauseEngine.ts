
export function analyzeRecall(description: string) {
  const text = description.toLowerCase();

  let system = "Unknown System";
  let failureMode = "Unknown Failure Mode";
  let safetyRisk = "Unknown Safety Risk";

  let potentialCauses: string[] = [];

  // =========================
  // SYSTEM DETECTION
  // =========================

  if (
    text.includes("brake") ||
    text.includes("hydraulic")
  ) {
    system = "Brake Hydraulic System";
  }

  if (
    text.includes("battery") ||
    text.includes("charging")
  ) {
    system = "High Voltage Battery System";
  }

  if (
    text.includes("airbag") ||
    text.includes("inflator")
  ) {
    system = "Airbag Restraint System";
  }

  if (
    text.includes("steering")
  ) {
    system = "Steering System";
  }

  if (
    text.includes("fuel")
  ) {
    system = "Fuel Delivery System";
  }

  if (
    text.includes("electrical") ||
    text.includes("wiring")
  ) {
    system = "Electrical Distribution System";
  }

  // =========================
  // FAILURE MODE
  // =========================

  if (
    text.includes("leak")
  ) {
    failureMode = "Fluid Leakage";
  }

  if (
    text.includes("overheat") ||
    text.includes("thermal")
  ) {
    failureMode = "Thermal Overheating";
  }

  if (
    text.includes("short circuit") ||
    text.includes("electrical short")
  ) {
    failureMode = "Electrical Short Circuit";
  }

  if (
    text.includes("crack") ||
    text.includes("fracture")
  ) {
    failureMode = "Structural Fracture";
  }

  if (
    text.includes("software")
  ) {
    failureMode = "Software Logic Failure";
  }

  if (
    text.includes("corrosion")
  ) {
    failureMode = "Corrosion Degradation";
  }

  // =========================
  // SAFETY RISK
  // =========================

  if (
    text.includes("fire")
  ) {
    safetyRisk = "Vehicle Fire Hazard";
  }

  if (
    text.includes("crash")
  ) {
    safetyRisk = "Crash Risk";
  }

  if (
    text.includes("reduced braking") ||
    text.includes("brake")
  ) {
    safetyRisk = "Loss of Braking Capability";
  }

  if (
    text.includes("loss of steering")
  ) {
    safetyRisk = "Loss of Steering Control";
  }

  if (
    text.includes("airbag") &&
    text.includes("fail")
  ) {
    safetyRisk = "Occupant Protection Failure";
  }

  // =========================
  // ENGINEERING CAUSES
  // =========================

  if (
    text.includes("leak")
  ) {
    potentialCauses.push(
      "Seal material degradation",
      "Hydraulic pressure fatigue",
      "Manufacturing tolerance variation",
      "Supplier component defect"
    );
  }

  if (
    text.includes("overheat")
  ) {
    potentialCauses.push(
      "Thermal management deficiency",
      "Cooling pathway restriction",
      "Battery cell instability",
      "Excessive heat cycling"
    );
  }

  if (
    text.includes("software")
  ) {
    potentialCauses.push(
      "Firmware logic defect",
      "Control module validation gap",
      "Sensor input misinterpretation",
      "State transition failure"
    );
  }

  if (
    text.includes("crack")
  ) {
    potentialCauses.push(
      "Fatigue stress accumulation",
      "Material brittleness",
      "Improper heat treatment",
      "Structural load concentration"
    );
  }

  if (
    text.includes("corrosion")
  ) {
    potentialCauses.push(
      "Moisture intrusion",
      "Protective coating degradation",
      "Galvanic corrosion reaction",
      "Environmental exposure cycling"
    );
  }

  // fallback

  if (potentialCauses.length === 0) {
    potentialCauses.push(
      "Supplier manufacturing variation",
      "Design validation gap",
      "Environmental stress exposure",
      "Assembly process deviation"
    );
  }

  return {
    system,
    failureMode,
    safetyRisk,
    potentialCauses,
  };
}
