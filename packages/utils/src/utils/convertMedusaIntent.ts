import {
  FillStructure,
  FillStructureEnumToString,
  FillStructureStr,
  FillStructureStringToEnum,
  type MedusaIntent,
  OutcomeAssetStructure,
  OutcomeAssetStructureEnumToString,
  OutcomeAssetStructureStr,
  OutcomeAssetStructureStringToEnum,
} from "../types";

export function convertMedusaIntent<
  F extends FillStructure | FillStructureStr,
  O extends OutcomeAssetStructure | OutcomeAssetStructureStr,
>(
  intent: MedusaIntent<F, O>,
): MedusaIntent<
  F extends FillStructureStr ? FillStructure : FillStructureStr,
  O extends OutcomeAssetStructureStr ? OutcomeAssetStructure : OutcomeAssetStructureStr
> {
  const fillStructure =
    FillStructureStringToEnum[intent.outcome.fillStructure as FillStructureStr] ??
    FillStructureEnumToString[intent.outcome.fillStructure as FillStructure];
  const outcomeAssetStructure =
    OutcomeAssetStructureStringToEnum[intent.outcome.outcomeAssetStructure as OutcomeAssetStructureStr] ??
    OutcomeAssetStructureEnumToString[intent.outcome.outcomeAssetStructure as OutcomeAssetStructure];
  return {
    ...intent,
    outcome: {
      ...intent.outcome,
      fillStructure: fillStructure as never,
      outcomeAssetStructure: outcomeAssetStructure as never,
    },
  };
}
