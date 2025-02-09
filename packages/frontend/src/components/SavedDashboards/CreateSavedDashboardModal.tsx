import {
    Button,
    Classes,
    Dialog,
    FormGroup,
    InputGroup,
    Intent,
} from '@blueprintjs/core';
import { Dashboard } from '@lightdash/common';
import { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useCreateMutation } from '../../hooks/dashboard/useDashboard';
import { useApp } from '../../providers/AppProvider';

interface CreateSavedDashboardModalProps {
    isOpen: boolean;
    tiles?: Dashboard['tiles'];
    showRedirectButton?: boolean;
    redirectToEditDashboard?: boolean;
    onClose?: () => void;
}

const CreateSavedDashboardModal: FC<CreateSavedDashboardModalProps> = ({
    isOpen,
    tiles,
    showRedirectButton,
    redirectToEditDashboard,
    onClose,
}) => {
    const history = useHistory();
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const useCreate = useCreateMutation(projectUuid, showRedirectButton, {
        onSuccess: (result) => {
            if (redirectToEditDashboard) {
                history.push(
                    `/projects/${projectUuid}/dashboards/${result.uuid}/edit`,
                );
            }

            if (onClose) onClose();
        },
    });
    const { mutate, isLoading: isCreating } = useCreate;
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const { user } = useApp();

    if (user.data?.ability?.cannot('manage', 'Dashboard')) return <></>;

    return (
        <Dialog isOpen={isOpen} onClose={onClose} lazy title="Create dashboard">
            <form>
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label="Name your dashboard"
                        labelFor="chart-name"
                    >
                        <InputGroup
                            id="chart-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="eg. KPI dashboard"
                        />
                    </FormGroup>
                    <FormGroup
                        label="Dashboard description"
                        labelFor="chart-description"
                    >
                        <InputGroup
                            id="chart-description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A few words to give your team some context"
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            data-cy="submit-base-modal"
                            intent={Intent.PRIMARY}
                            text="Create"
                            type="submit"
                            loading={isCreating}
                            onClick={(e) => {
                                mutate({
                                    tiles: tiles || [],
                                    name,
                                    description,
                                });
                                e.preventDefault();
                            }}
                            disabled={isCreating || !name}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default CreateSavedDashboardModal;
