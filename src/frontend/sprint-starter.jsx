import { Select, Inline, DynamicTable, Button, Text, Strong, Stack, Heading, Label, RequiredAsterisk, Textfield, Box, HelperMessage } from "@forge/react";
import React, { useState, useEffect } from "react";
import { requestJira } from '@forge/bridge';

const SprintStarter = () => {
    const MAX_BOARD_RESULTS = 1000; // Will need to think of a way to handle > 1000 boards in a project
    const [boards, setBoards] = useState([]);
    const [futureSprints, setFutureSprints] = useState([]);
    const [parents, setParents] = useState([]);
    const [selectedParents, setSelectedParents] = useState([]);
    const [activeSprint, setActiveSprint] = useState(undefined);
    const [selectedBoardId, setSelectedBoardId] = useState(undefined);
    const [searchPending, setSearchPending] = useState(false);
    const [issueSearchResults, setIssueSearchResults] = useState([]);

    const onRemoveFromSprintClick = (issueKey) => {
        const updatedSprintIssues = sprintIssues.filter(sprintIssue => sprintIssue.key !== issueKey);
        setSprintIssues(updatedSprintIssues);
    };
    const [sprintIssues, setSprintIssues] = useState([
        {
            key: 'TEST-2',
            cells: [
                {
                    key: 'key',
                    content: 'TEST-2'
                },
                {
                    key: 'summary',
                    content: 'adafdf'
                },
                {
                    key: 'parent',
                    content: 'TEST-5'
                },
                {
                    key: 'storyPoints',
                    content: '1'
                },
                {
                    key: 'priority',
                    content: 'Highest'
                },
                {
                    key: 'removeButton',
                    content: <Button shouldFitContainer onClick={() => onRemoveFromSprintClick('TEST-2')} iconAfter="trash">Remove From Sprint</Button>
                }
            ]
        },
        {
            key: 'TEST-6',
            cells: [
                {
                    key: 'key',
                    content: 'TEST-6'
                },
                {
                    key: 'summary',
                    content: 'Fix service discovery in AWS'
                },
                {
                    key: 'parent',
                    content: 'TEST-5'
                },
                {
                    key: 'storyPoints',
                    content: '8'
                },
                {
                    key: 'priority',
                    content: 'High'
                },
                {
                    key: 'removeButton',
                    content: <Button shouldFitContainer onClick={() => onRemoveFromSprintClick('TEST-6')} iconAfter="trash">Remove From Sprint</Button>
                }
            ]
        },
        {
            key: 'TEST-7',
            cells: [
                {
                    key: 'key',
                    content: 'TEST-7'
                },
                {
                    key: 'summary',
                    content: 'Create initial GET endpoint'
                },
                {
                    key: 'parent',
                    content: 'TEST-5'
                },
                {
                    key: 'storyPoints',
                    content: '3'
                },
                {
                    key: 'priority',
                    content: 'Medium'
                },
                {
                    key: 'removeButton',
                    content: <Button shouldFitContainer onClick={() => onRemoveFromSprintClick('TEST-7')} iconAfter="trash">Remove From Sprint</Button>
                }
            ]
        },
        {
            key: 'TEST-8',
            cells: [
                {
                    key: 'key',
                    content: 'TEST-8'
                },
                {
                    key: 'summary',
                    content: 'Create dockerfiles'
                },
                {
                    key: 'parent',
                    content: 'TEST-5'
                },
                {
                    key: 'storyPoints',
                    content: '5'
                },
                {
                    key: 'priority',
                    content: 'Low'
                },
                {
                    key: 'removeButton',
                    content: <Button shouldFitContainer onClick={() => onRemoveFromSprintClick('TEST-8')} iconAfter="trash">Remove From Sprint</Button>
                }
            ]
        },
        {
            key: 'TEST-9',
            cells: [
                {
                    key: 'key',
                    content: 'TEST-9'
                },
                {
                    key: 'summary',
                    content: 'Create CI pipeline'
                },
                {
                    key: 'parent',
                    content: 'TEST-5'
                },
                {
                    key: 'storyPoints',
                    content: '5'
                },
                {
                    key: 'priority',
                    content: 'Lowest'
                },
                {
                    key: 'removeButton',
                    content: <Button shouldFitContainer onClick={() => onRemoveFromSprintClick('TEST-9')} iconAfter="trash">Remove From Sprint</Button>
                }
            ]
        },
        {
            key: 'TEST-4',
            cells: [
                {
                    key: 'key',
                    content: 'TEST-4'
                },
                {
                    key: 'summary',
                    content: 'Random task'
                },
                {
                    key: 'parent',
                    content: 'TEST-3'
                },
                {
                    key: 'storyPoints',
                    content: '1'
                },
                {
                    key: 'priority',
                    content: 'Medium'
                },
                {
                    key: 'removeButton',
                    content: <Button shouldFitContainer onClick={() => onRemoveFromSprintClick('TEST-4')} iconAfter="trash">Remove From Sprint</Button>
                }
            ]
        }
    ]);
    const [sprintIssuesTableLoading, setSprintIssuesTableLoading] = useState(false);
    const [fullSprintCapacity, setFullSprintCapacity] = useState(undefined);

    const getBoardsTableHeader = () => {
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

    const getSelectedParentsTableHeader = () => {
        return {
            cells: [
                {
                    key: 'key',
                    content: 'Key',
                    isSortable: true
                },
                {
                    key: 'summary',
                    content: 'Summary',
                    isSortable: true
                }
            ]
        };
    };

    const getSprintIssuesTableHeader = () => {
        return {
            cells: [
                {
                    key: 'key',
                    content: 'Key',
                    isSortable: true
                },
                {
                    key: 'summary',
                    content: 'Summary',
                    isSortable: true
                },
                {
                    key: 'parent',
                    content: 'Parent Key',
                    isSortable: true
                },
                {
                    key: 'storyPoints',
                    content: 'Story Points',
                    isSortable: true
                },
                {
                    key: 'priority',
                    content: 'Priority',
                    isSortable: true
                }
            ]
        };
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

        // get parents
        const parentResponse = await requestJira(`/rest/agile/1.0/board/${boardId}/epic`);
        const parentData = await parentResponse.json();
        const parents = parentData.values.map(parent => {
            return {
                label: parent.key,
                value: parent.id,
                key: parent.key,
                cells: [
                    {
                        key: 'parentKey',
                        content: parent.key
                    },
                    {
                        key: 'parentSummary',
                        content: parent.summary
                    }
                ]
            };
        });

        // set state
        setFutureSprints(futureSprints);
        setParents(parents);
        setActiveSprint(activeSprint);
        setSelectedBoardId(boardId);
    };

    const onRankEnd = ({sourceIndex, destination}) => {
        const selectedParentsCopy = [...selectedParents];
        const offset = destination.index - sourceIndex;
        const rankedItem = selectedParentsCopy.at(sourceIndex);
        const start = offset > 0 ? sourceIndex + 1 : destination.index;
        const end = offset > 0 ? offset + 1 : sourceIndex;
        const itemsToShift = selectedParentsCopy.slice(start, end);
        selectedParentsCopy[destination.index] = rankedItem;
        for(let i = start; i < end; i++) {
            selectedParentsCopy[offset > 0 ? i - 1 : i + 1] = itemsToShift[i];
        }
        setSelectedParents(selectedParentsCopy);
    };

    const onGetRecommendedIssuesClick = () => {
        setSprintIssuesTableLoading(true);
        // Get issues that are still in progress in the current sprint
        // Subtract the number of story points from the full capacity
        // Get issues for ranked parent.
        // Compare number of story points against remaining capacity
        // If more story points are allowed, get issues for next ranked parent & update sprint issues list
        // If no more story points are allowed, update issues need sorting list
        // Sort issues need sorting list by priorty & dependency/blocked links
        // Get issue from sorted list
        // Compare number of story points against remaining capacity
        // If more story points are allowed, get next issue from sorted list & update sprint issuess list
        // If no more story points are allowed, exit
        setSprintIssuesTableLoading(false);
    };

    const searchIssues = async (searchValue) => {
        setSearchPending(true);
        const response = await requestJira(`/rest/api/3/issue/picker?query=${searchValue}`);
        const data = await response.json();
        const finalArr = data.sections.flatMap(section => section.issues).map(issue => {
            return {
                label: issue.key,
                value: issue.key
            };
        });
        setIssueSearchResults(finalArr);
        setSearchPending(false);
    };

    const onIssueSearchChange = async (value) => {
        if (!searchPending) /* condition can be buggy - consider using debounce (suggested by copilot) */ {    
            await searchIssues(value);
        }
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
                <DynamicTable head={getBoardsTableHeader()} rows={boards} isRankable={false} />
            </Stack>
        }
            <Stack>
            {futureSprints.length > 0 &&
                <Inline space='space.200'>
                    <Box>
                    {activeSprint &&
                        <Box paddingBlockEnd='space.300' paddingBlockStart='space.300'>
                            <Text>
                                <Strong>{`${activeSprint.name} is the current sprint`}</Strong>
                            </Text>
                        </Box>
                    }
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
                                    Full Sprint Capacity (points)
                                    <RequiredAsterisk />
                                </Label>
                                <Textfield id='sprint-capacity' onChange={setFullSprintCapacity} />
                                <HelperMessage>
                                    Rollover issues from previous sprint are automatically deducted
                                </HelperMessage>
                            </Stack>
                            <Stack>
                                <Label labelFor='parents'>
                                    Priority Parent Issues (Epic)
                                    <RequiredAsterisk />
                                </Label>
                                <Select options={parents} id='parents' isMulti={true} onChange={setSelectedParents} />
                                <HelperMessage>
                                    Contact your Jira admin to set parent issue types
                                </HelperMessage>
                            </Stack>
                        </Inline>
                        <Box paddingBlockStart='space.300'>
                            <DynamicTable 
                                head={getSelectedParentsTableHeader()} 
                                rows={selectedParents} 
                                onRankEnd={onRankEnd} 
                                isRankable 
                            />
                            <HelperMessage>
                                Drag & drop to rank parent priority
                            </HelperMessage>
                        </Box>
                        <Box paddingBlockStart='space.300'>
                            <Button iconAfter="sprint" onClick={onGetRecommendedIssuesClick}>Get Recommended Issues</Button>
                        </Box>
                    </Box>
                    {// sprintIssues &&
                        <Box>
                            <Box paddingBlockStart='space.300'>
                                <Heading as='h1'>Available Capacity: 25 Points</Heading>
                            </Box>
                            <Box paddingBlockStart='space.300' paddingBlockEnd='space.300'>
                                <Heading as='h2'>5 Points Rolling Over</Heading>
                            </Box>
                            <Inline alignBlock={'end'} space='space.200'>
                                <Stack>
                                    <Label labelFor='issue-search'>
                                        Issues to add to the sprint
                                    </Label>
                                    <Select
                                        id='issue-search'
                                        onInputChange={onIssueSearchChange}
                                        options={issueSearchResults}
                                        isMulti
                                    />
                                </Stack>
                                <Button iconAfter="add">Add To Sprint</Button>
                            </Inline>
                            <Box paddingBlockStart='space.300'>
                                <DynamicTable head={getSprintIssuesTableHeader()} rows={sprintIssues} />
                            </Box>
                            <Button iconAfter="sprint" appearance="primary">Start Sprint</Button>
                        </Box>
                    }
                </Inline>
            }
            </Stack>
        </>
    );
};

export default SprintStarter;