import { Form, FormHeader, FormSection, FormFooter, Label, RequiredAsterisk, Button, useForm, Select, HelperMessage, Box } from "@forge/react";
import React from 'react';

const JiraAdmin = () => {
    const { register, getFieldId } = useForm();

    const getStoryPointsFieldOptions = () => {
        return [
            {
                label: 'Story Points',
                value: '1'
            },
            {
                label: 'Story Points Estimate',
                value: '2'
            }
        ];
    };

    const getParentIssuesOptions = () => {
        return [
            {
                label: 'Epic',
                value: '1'
            },
            {
                label: 'Feature',
                value: '2'
            }
        ];
    };

    return (
        <Box paddingBlockStart='space.300'>
            <Form>
                <FormHeader title="Admin Configuration">
                    Change what fields/parents are used
                </FormHeader>
                <FormSection>
                    <Label labelFor={getFieldId("story-points-field")}>
                        Story Points Field
                        <RequiredAsterisk />
                    </Label>
                    <Select options={getStoryPointsFieldOptions()}  {...register('story-points-field', {required: true})} />
                    <HelperMessage>
                        This is the field that will be updated on issues from the Sprint Refinement tab
                    </HelperMessage>
                    <Label labelFor={getFieldId("parent-issues")}>
                        Parent Issues
                        <RequiredAsterisk />
                    </Label>
                    <Select isMulti options={getParentIssuesOptions()}  {...register('parent-issues', {required: true})} />
                    <HelperMessage>
                        These are parent issue types that can be used to prioritize & assign child issues to a sprint on the Sprint Starter tab
                    </HelperMessage>
                </FormSection>
                <FormFooter>
                    <Button appearance="primary" type="submit">
                        Submit
                    </Button>
                </FormFooter>
            </Form>
        </Box>
    );
};

export default JiraAdmin;
