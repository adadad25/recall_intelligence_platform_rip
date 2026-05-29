import nlp from "compromise";

export function analyzeRecall(description: string) {
  const text = description.toLowerCase();

  let system = "General Vehicle System";
  let failureMode = "Unknown Failure Mode";
  let safetyRisk = "Unknown Safety Risk";

  let potentialCauses: string[] = [];

  /* =========================
     SYSTEM DETECTION
  ========================= */

  if (
    text.includes("brake") ||
    text.includes("abs")
  ) {
    system = "Brake System";
  }

  else if (
    text.includes("steering")
  ) {
    system = "Steering System";
  }

  else if (
    text.includes("air bag") ||
    text.includes("airbag")
  ) {
    system = "Airbag System";
  }

  else if (
    text.includes("battery") ||
    text.includes("electrical")
  ) {
    system = "Electrical System";
  }

  else if (
    text.includes("fuel")
  ) {
    system = "Fuel System";
  }

  else if (
    text.includes("engine")
  ) {
    system = "Engine System";
  }

  else if (
    text.includes("transmission")
  ) {
    system = "Transmission System";
  }

  else if (
    text.includes("tire")
  ) {
    system = "Tire System";
  }

  else if (
    text.includes("seat belt")
  ) {
    system = "Seat Belt System";
  }

  else if (
    text.includes("camera")
  ) {
    system = "Driver Assistance System";
  }

  /* =========================
     FAILURE MODE DETECTION
  ========================= */

  if (
    text.includes("fire") ||
    text.includes("burn")
  ) {
    failureMode = "Thermal Event / Fire";
  }

  else if (
    text.includes("leak")
  ) {
    failureMode = "Fluid Leakage";
  }

  else if (
    text.includes("fracture") ||
    text.includes("crack")
  ) {
    failureMode = "Structural Fracture";
  }

  else if (
    text.includes("detach")
  ) {
    failureMode = "Component Detachment";
  }

  else if (
    text.includes("loss of braking")
  ) {
    failureMode = "Brake Performance Loss";
  }

  else if (
    text.includes("stall")
  ) {
    failureMode = "Engine Stall";
  }

  else if (
    text.includes("short circuit")
  ) {
    failureMode = "Electrical Short Circuit";
  }

  else if (
    text.includes("overheat")
  ) {
    failureMode = "Thermal Overheating";
  }

  else if (
    text.includes("loss of steering")
  ) {
    failureMode = "Steering Control Loss";
  }

  else if (
    text.includes("incorrect deployment")
  ) {
    failureMode = "Improper Airbag Deployment";
  }

  else if (
    text.includes("software")
  ) {
    failureMode = "Software Logic Defect";
  }

  /* =========================
     SAFETY RISK DETECTION
  ========================= */

  if (
    text.includes("crash")
  ) {
    safetyRisk = "Vehicle Crash Risk";
  }

  else if (
    text.includes("injury")
  ) {
    safetyRisk = "Occupant Injury Risk";
  }

  else if (
    text.includes("fire")
  ) {
    safetyRisk = "Vehicle Fire Risk";
  }

  else if (
    text.includes("loss of braking")
  ) {
    safetyRisk = "Loss of Vehicle Braking";
  }

  else if (
    text.includes("loss of steering")
  ) {
    safetyRisk = "Loss of Vehicle Control";
  }

  else if (
    text.includes("air bag fails")
  ) {
    safetyRisk = "Reduced Crash Protection";
  }

  else if (
    text.includes("rollaway")
  ) {
    safetyRisk = "Unintended Vehicle Movement";
  }

  else if (
    text.includes("visibility")
  ) {
    safetyRisk = "Reduced Driver Visibility";
  }

  else if (
    text.includes("stall")
  ) {
    safetyRisk = "Loss of Propulsion";
  }

  /* =========================
     ENGINEERING CAUSES
  ========================= */

  if (
    text.includes("leak")
  ) {
    potentialCauses.push(
      "Seal degradation",
      "Improper joint sealing",
      "Pressure fatigue failure"
    );
  }

  if (
    text.includes("fire")
  ) {
    potentialCauses.push(
      "Thermal runaway",
      "Electrical insulation failure",
      "Combustible material exposure"
    );
  }

  if (
    text.includes("fracture") ||
    text.includes("crack")
  ) {
    potentialCauses.push(
      "Material fatigue",
      "Stress concentration",
      "Manufacturing defect"
    );
  }

  if (
    text.includes("software")
  ) {
    potentialCauses.push(
      "Software validation gap",
      "Logic condition failure",
      "Calibration defect"
    );
  }

  if (
    text.includes("short circuit")
  ) {
    potentialCauses.push(
      "Wire insulation damage",
      "Connector contamination",
      "Electrical overload"
    );
  }

  if (
    text.includes("detach")
  ) {
    potentialCauses.push(
      "Fastener torque loss",
      "Improper assembly",
      "Vibration fatigue"
    );
  }

  if (
    potentialCauses.length === 0
  ) {
    potentialCauses.push(
      "Supplier manufacturing variation",
      "Environmental degradation",
      "Design robustness gap"
    );
  }

  return {
    system,
    failureMode,
    safetyRisk,
    potentialCauses,
  };
}
