import { XIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';

type InputTagsProps = InputProps & {
    value: string[];
    onChange: (value: string[]) => void;
    disableKeys?: boolean;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
    ({ value, onChange, disableKeys, ...props }, ref) => {
        const [pendingDataPoint, setPendingDataPoint] = useState('');

        const addPendingDataPoint = () => {
            if (pendingDataPoint) {
                const newDataPoints = new Set([...value, pendingDataPoint.toLowerCase()]);
                onChange(Array.from(newDataPoints));
                setPendingDataPoint('');
            }
        };

        return (
            <>
                {value.length > 0 && (
                    <div className="rounded-md overflow-y-auto flex gap-2 flex-wrap items-center">
                        {value.map((item, idx) => (
                            <Badge key={idx} variant="secondary">
                                {item}
                                <button
                                    type="button"
                                    className="w-3 ml-2"
                                    onClick={() => {
                                        onChange(
                                            value.filter((i) => i !== item),
                                        );
                                    }}
                                >
                                    <XIcon className="w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <Input
                        value={pendingDataPoint}
                        onChange={(e) => setPendingDataPoint(e.target.value)}
                        onKeyDown={(e) => {
                            if (disableKeys) return;

                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addPendingDataPoint();
                            } else if (e.key === ',' || e.key === ' ') {
                                e.preventDefault();
                                addPendingDataPoint();
                            }
                        }}
                        className="flex-1"
                        {...props}
                        ref={ref}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={addPendingDataPoint}
                    >
                        <MaterialSymbolsAddRounded />
                    </Button>
                </div>
            </>
        );
    },
);
