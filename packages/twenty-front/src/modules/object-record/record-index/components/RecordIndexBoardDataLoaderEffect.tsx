import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useRecordActionBar } from '@/object-record/record-action-bar/hooks/useRecordActionBar';
import { useRecordBoard } from '@/object-record/record-board/hooks/useRecordBoard';
import { useRecordBoardSelection } from '@/object-record/record-board/hooks/useRecordBoardSelection';
import { recordIndexFieldDefinitionsState } from '@/object-record/record-index/states/recordIndexFieldDefinitionsState';
import { recordIndexIsCompactModeActiveState } from '@/object-record/record-index/states/recordIndexIsCompactModeActiveState';
import { recordIndexKanbanFieldMetadataIdState } from '@/object-record/record-index/states/recordIndexKanbanFieldMetadataIdState';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { isDefined } from '~/utils/isDefined';
import { recordIndexGroupDefinitionsState } from '@/object-record/record-index/states/recordIndexGroupDefinitionsState';

type RecordIndexBoardDataLoaderEffectProps = {
  objectNameSingular: string;
  recordBoardId: string;
};

export const RecordIndexBoardDataLoaderEffect = ({
  objectNameSingular,
  recordBoardId,
}: RecordIndexBoardDataLoaderEffectProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const recordIndexFieldDefinitions = useRecoilValue(
    recordIndexFieldDefinitionsState,
  );

  const recordIndexGroupDefinitions = useRecoilValue(
    recordIndexGroupDefinitionsState,
  );

  const recordIndexKanbanFieldMetadataId = useRecoilValue(
    recordIndexKanbanFieldMetadataIdState,
  );

  const recordIndexIsCompactModeActive = useRecoilValue(
    recordIndexIsCompactModeActiveState,
  );

  const { isCompactModeActiveState } = useRecordBoard(recordBoardId);

  const setIsCompactModeActive = useSetRecoilState(isCompactModeActiveState);

  useEffect(() => {
    setIsCompactModeActive(recordIndexIsCompactModeActive);
  }, [recordIndexIsCompactModeActive, setIsCompactModeActive]);

  const {
    setColumns,
    setObjectSingularName,
    selectedRecordIdsSelector,
    setFieldDefinitions,
    setKanbanFieldMetadataName,
  } = useRecordBoard(recordBoardId);

  useEffect(() => {
    setFieldDefinitions(recordIndexFieldDefinitions);
  }, [recordIndexFieldDefinitions, setFieldDefinitions]);

  const { resetRecordSelection } = useRecordBoardSelection(recordBoardId);

  useEffect(() => {
    setObjectSingularName(objectNameSingular);
  }, [objectNameSingular, setObjectSingularName]);

  useEffect(() => {
    setColumns(recordIndexGroupDefinitions);
  }, [recordIndexGroupDefinitions, setColumns]);

  // FixMe: Why do we have 2 useEffects for setFieldDefinitions?
  useEffect(() => {
    setFieldDefinitions(recordIndexFieldDefinitions);
  }, [objectMetadataItem, setFieldDefinitions, recordIndexFieldDefinitions]);

  useEffect(() => {
    if (isDefined(recordIndexKanbanFieldMetadataId)) {
      const kanbanFieldMetadataName = objectMetadataItem?.fields.find(
        (field) =>
          field.type === FieldMetadataType.Select &&
          field.id === recordIndexKanbanFieldMetadataId,
      )?.name;

      if (isDefined(kanbanFieldMetadataName)) {
        setKanbanFieldMetadataName(kanbanFieldMetadataName);
      }
    }
  }, [
    objectMetadataItem,
    recordIndexKanbanFieldMetadataId,
    setKanbanFieldMetadataName,
  ]);

  const selectedRecordIds = useRecoilValue(selectedRecordIdsSelector());

  const { setActionBarEntries, setContextMenuEntries } = useRecordActionBar({
    objectMetadataItem,
    selectedRecordIds,
    callback: resetRecordSelection,
  });

  useEffect(() => {
    setActionBarEntries?.();
    setContextMenuEntries?.();
  }, [setActionBarEntries, setContextMenuEntries]);

  return <></>;
};
