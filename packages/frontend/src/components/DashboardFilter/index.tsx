import { Classes } from '@blueprintjs/popover2';
import React, { FC, useState } from 'react';
import { FilterTrigger, TriggerWrapper } from './DashboardFilter.styles';
import FilterSearch from './FilterSearch';

interface Props {
    chartsData: any;
}

const DashboardFilter: FC<Props> = ({ chartsData }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TriggerWrapper
                content={<FilterSearch chartsData={chartsData} />}
                interactionKind="click"
                popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                isOpen={isOpen}
                onInteraction={setIsOpen}
                position="bottom"
                lazy={false}
            >
                <FilterTrigger minimal icon="filter-list">
                    Add filter
                </FilterTrigger>
            </TriggerWrapper>
        </>
    );
};

export default DashboardFilter;
