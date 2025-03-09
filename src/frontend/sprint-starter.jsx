import { Select, Inline, DynamicTable, Button, Text, Strong, Stack, Heading, Label, RequiredAsterisk, Textfield, Box, HelperMessage } from "@forge/react";
import React, { useState, useEffect } from "react";
import { requestJira } from '@forge/bridge';

const SprintStarter = () => {
    const MAX_BOARD_RESULTS = 1000; // Will need to think of a way to handle > 1000 boards in a project
    const [boards, setBoards] = useState([]);
    const [futureSprints, setFutureSprints] = useState([]);
    const [epics, setEpics] = useState([]);
    const [activeSprint, setActiveSprint] = useState(undefined);
    const [selectedBoardId, setSelectedBoardId] = useState(undefined);

    const getTableHeader = () => {
        return {
            cells: [
                {
                    key: 'boardName',
                    content: 'Board Name',
                    isSortable: true
                },
                {
                    key: 'projectKey',
                    content: 'Key',
                    isSortable: true
                }
            ]
        }
    };

    const onBoardClick = async (boardId) => {
        // get sprints
        const response = await requestJira(`/rest/agile/1.0/board/${boardId}/sprint?state=active,future`);
        const data = await response.json();
        const futureSprints = data.values.filter(sprint => sprint.state === 'future').map(sprint => {
            return {
                label: sprint.name,
                value: sprint.id
            };
        });
        const activeSprint = data.values.find(sprint => sprint.state === 'active');

        // get epics
        const epicResponse = await requestJira(`/rest/agile/1.0/board/${boardId}/epic`);
        const epicData = await epicResponse.json();
        const epics = epicData.values.map(epic => {
            return {
                label: epic.key,
                value: epic.id
            };
        });

        // set state
        setFutureSprints(futureSprints);
        setEpics(epics);
        setActiveSprint(activeSprint);
        setSelectedBoardId(boardId);
    };

    useEffect(() => {
        const asyncEffect = async () => {
            const response = await requestJira(`/rest/agile/1.0/board?maxResults=${MAX_BOARD_RESULTS}`);
            const data = await response.json();
            const tableRows = data.values.map(board => {
                return {
                    key: board.id,
                    cells: [
                        {
                            key: 'boardName',
                            content: board.name
                        },
                        {
                            key: 'projectKey',
                            content: board.location.projectKey
                        },
                        {
                            key: 'button',
                            content: <Button shouldFitContainer={true} onClick={async () => await onBoardClick(board.id)} iconAfter="board">Choose Board</Button>
                        }
                    ]
                };
            });
            setBoards(tableRows);
        };
        asyncEffect();
      }, []);

    return (
        <>
            {boards.length > 0 && !selectedBoardId &&
                <Stack>
                    <Heading as='h1'>Select Your Board</Heading>
                    <DynamicTable head={getTableHeader()} rows={boards} isRankable={false} />
                </Stack>
            }
            <Stack>
                {activeSprint &&
                    <Box paddingBlockEnd='space.300' paddingBlockStart='space.300'>
                        <Text>
                            <Strong>{`${activeSprint.name} is the current sprint`}</Strong>
                        </Text>
                    </Box>
                }
                {futureSprints.length > 0 &&
                    <>
                        <Inline space='space.200' alignBlock={'start'}>
                            <Stack>
                                <Label labelFor='sprint'>
                                    Sprint
                                    <RequiredAsterisk />
                                </Label>
                                <Select options={futureSprints} id='sprint' />
                            </Stack>
                            <Stack>
                                <Label labelFor='sprint-capacity'>
                                    Sprint Capacity
                                    <RequiredAsterisk />
                                </Label>
                                <Textfield id='sprint-capacity' />
                            </Stack>
                            <Stack>
                                <Label labelFor='epics'>
                                    Priority Parent Issues (Epic)
                                    <RequiredAsterisk />
                                </Label>
                                <Select options={epics} id='epics' isMulti={true} />
                                <HelperMessage>
                                    Contact your Jira admin to set parent issue types
                                </HelperMessage>
                            </Stack>
                        </Inline>
                        <Box paddingBlockStart='space.300'>
                            <Button iconAfter="sprint">Get Recommended Issues</Button>
                        </Box>
                    </>
                }
            </Stack>
        </>
    );
};

export default SprintStarter;