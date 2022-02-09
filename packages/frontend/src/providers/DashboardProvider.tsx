import { Field, FieldType, FilterRule } from 'common';
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from 'react';

type DashboardFilters = {
    dimensionFilters: FilterRule[];
    metricFilters: FilterRule[] | [];
};

type DashboardContext = {
    dashboardFilters: DashboardFilters;
    setDashboardFilters: Dispatch<SetStateAction<DashboardFilters>>;
    addDimensionDashboardFilter: (filter: FilterRule) => void;
    addMetricDashboardFilter: (filter: FilterRule) => void;
    dimensionToFilter: Field;
    setDimensionToFilter: Dispatch<SetStateAction<Field>>;
};

const dimension = {
    fieldType: FieldType.DIMENSION,
    type: '',
    name: '',
    label: '',
    table: '',
    tableLabel: '',
    sql: '',
    description: '',
    source: undefined,
};

const Context = createContext<DashboardContext>({
    dashboardFilters: { dimensionFilters: [], metricFilters: [] },
    setDashboardFilters: () => {},
    addDimensionDashboardFilter: () => {},
    addMetricDashboardFilter: () => {},
    dimensionToFilter: dimension,
    setDimensionToFilter: () => {},
});

export const DashboardProvider: React.FC = ({ children }) => {
    const [dashboardFilters, setDashboardFilters] = useState<DashboardFilters>({
        dimensionFilters: [],
        metricFilters: [],
    });

    const updateDimensionFilter = (prev: any[], filter: any) => {
        const needsUpdateIndex = prev.findIndex(
            (item) => item.target.fieldId === filter.target.fieldId,
        );
        if (needsUpdateIndex !== -1) {
            return [...prev];
        }
        return [...prev, filter];
    };

    const [dimensionToFilter, setDimensionToFilter] =
        useState<Field>(dimension);
    const addDimensionDashboardFilter = useCallback(
        (filter) => {
            setDashboardFilters((previousFilters) => ({
                dimensionFilters: updateDimensionFilter(
                    previousFilters.dimensionFilters,
                    filter,
                ),
                metricFilters: previousFilters.metricFilters,
            }));
        },
        [setDashboardFilters],
    );
    const addMetricDashboardFilter = useCallback(
        (filter) => {
            setDashboardFilters((previousFilters) => ({
                dimensionFilters: previousFilters.dimensionFilters,
                metricFilters: [...previousFilters.metricFilters, filter],
            }));
        },
        [setDashboardFilters],
    );
    const value = {
        dashboardFilters,
        addDimensionDashboardFilter,
        addMetricDashboardFilter,
        setDimensionToFilter,
        dimensionToFilter,
        setDashboardFilters,
    };
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useDashboardContext = (): DashboardContext => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error(
            'useDashboardContext must be used within a DashboardProvider',
        );
    }
    return context;
};
