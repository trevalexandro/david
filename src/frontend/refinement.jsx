import {Box, Select, Stack, Heading, AdfRenderer, List, ListItem, TextArea, Button, Inline, Label, RequiredAsterisk, Textfield, HelperMessage} from '@forge/react';
import React, {useState} from 'react';
import { requestJira } from '@forge/bridge';

const Refinement = () => {
    const [issueSearchResults, setIssueSearchResults] = useState([]);
    const [searchPending, setSearchPending] = useState(false);
    const [currentIssueSummary, setCurrentIssueSummary] = useState('');
    const [currentIssueDescription, setCurrentIssueDescription] = useState({});

    // TODO - AdfRenderer is currently in preview and may not be available in the Forge platform long-term.
    // The following code is a workaround to render the description content of the issue in the Refinement component if/when needed
    // WILL NEED TO BE TESTED.
    /*const getDescriptionText = (descriptionContent, sortValue) => {
        return new Promise((resolve, _) => {
            resolve({
                text: descriptionContent.text,
                sortValue
            });
        });
    };

    const getDescriptionPromises = (descriptionContent, parentIndex = undefined) => {
        const descriptionPromises = [];
        descriptionContent.forEach((content, index) => {
            const sortValue = parentIndex !== undefined ? `${parentIndex}${index}` : index;
            if (content.content.length === 1) {
                descriptionPromises.push(getDescriptionText(content.content, sortValue));
            }
            if (content.content.length > 1) {
                descriptionPromises.push(getDescriptionPromises(content.content, sortValue));
            }
        });
        return descriptionPromises;
    };*/

    const getIssueOverview = async (value) => {
        const response = await requestJira(`/rest/api/3/issue/${value}?fields=summary,description`);
        const data = await response.json();
        /*const descriptionPromises = data.fields.description.content.map(content => getDescriptionPromises(content));
        const descriptionTextArr = await Promise.all(descriptionPromises);
        const descriptionText = descriptionTextArr.sort((a, b) => a.sortValue - b.sortValue).map(content => content.text);
        console.log(descriptionText);*/
        setCurrentIssueSummary(data.fields.summary);
        setCurrentIssueDescription(data.fields.description);
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

    const onIssueSelectChange = async (selectOption) => {
        await getIssueOverview(selectOption.value);
    };

    const getStoryPointJustification = () => {
        const points = [
            'Complexity: Writing unit tests to achieve 80% code coverage requires analyzing existing code, handling edge cases, and ensuring meaningful test coverage.',
            'Lower Integration Effort: Since the CI/CD pipeline already runs test suites for other services, no pipeline modifications are needed, reducing effort.',
            'Existing Patterns: Using Jest and following established patterns minimizes decision-making and setup time.',
            'Code Testability: If the Products service is not well-structured for testing, some refactoring may be necessary, adding effort.',
            'Verification & Debugging: Ensuring accurate coverage reports and meaningful test failures still requires thorough validation.'
        ];

        return points.map((point, index) => <ListItem key={index}>{point}</ListItem>);
    };

    const getAmbitionLevelOptions = () => {
        return [
            {label: 'Normal', value: 'normal'},
            {label: 'Ambitious', value: 'ambitious'},
            {label: 'Conservative', value: 'conservative'}
        ];
    };

    const getMaxStoryPointOptions = () => {
        return [
            {label: '8', value: 8},
            {label: '13', value: 13}
        ];
    };
    
    return (
        <Inline>
            <Box paddingBlockStart='space.300' paddingBlockEnd='space.300' paddingInlineEnd='space.300'>
                <Box paddingBlockEnd={'space.200'}>
                    <Select
                        onInputChange={onIssueSearchChange}
                        onChange={onIssueSelectChange}
                        options={issueSearchResults}
                        placeholder="Find an issue to refine"
                    />
                </Box>
                <Stack>
                    <Heading as='h1'>{currentIssueSummary}</Heading>
                    <AdfRenderer document={currentIssueDescription} />
                    <Box paddingBlockEnd={'space.200'} paddingBlockStart={'space.200'}>
                        <Heading as='h1'>Recommended Story Point Estimate: 5</Heading>
                    </Box>
                    <Heading as='h2'>Justification</Heading>
                    <List type='ordered'>
                        {getStoryPointJustification()}
                    </List>
                    <Box paddingBlockEnd={'space.200'} paddingBlockStart={'space.200'}>
                        <TextArea placeholder="Tell me more so I can make a better estimate" />
                    </Box>
                    <Inline space="space.200" alignBlock='end'>
                        <Button appearance='default' iconAfter='lightbulb'>Get New Estimate</Button>
                        <Stack>
                            <Label labelFor="ambition-level">
                                Estimate Type
                                <RequiredAsterisk />
                            </Label>
                            <Select
                                id="ambition-level"
                                options={getAmbitionLevelOptions()}
                                isSearchable={false}
                                defaultValue={getAmbitionLevelOptions()[0]}
                            />
                        </Stack>
                        <Stack>
                            <Label labelFor="max-story-points">
                                Max Estimate
                                <RequiredAsterisk />
                            </Label>
                            <Select
                                id="max-story-points"
                                options={getMaxStoryPointOptions()}
                                isSearchable={false}
                                defaultValue={getMaxStoryPointOptions()[0]}
                            />
                        </Stack>
                    </Inline>
                </Stack>
            </Box>
            <Box paddingBlockStart='space.300' paddingInlineStart='space.300'>
                <Box paddingBlockEnd={'space.200'}>
                    <Heading as='h1'>Final Estimate</Heading>
                </Box>
                <Box paddingBlockEnd={'space.200'}>
                    <Stack>
                        <Label labelFor='final-estimate'>
                            This will update the Story Points field on the issue
                            <RequiredAsterisk />
                        </Label>
                        <Textfield defaultValue='5' id='final-estimate' />
                        <HelperMessage>Contact your Jira admin to change what field gets updated</HelperMessage>
                    </Stack>
                </Box>
                <Button appearance='primary' iconAfter='check'>Update Issue</Button>
            </Box>
        </Inline>
    );
};

export default Refinement;
