import { ComponentPropsWithoutRef, FC } from 'react';

import { cn } from '@/utils/utils';

interface Props extends ComponentPropsWithoutRef<'div'> {
    extended?: boolean;
    size?: keyof typeof SIZES;
    extendedSize?: keyof typeof EXTENDED_SIZES;
}

const SIZES = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-4 md:grid-cols-6',
    7: 'grid-cols-5 md:grid-cols-7',
    8: 'grid-cols-6 md:grid-cols-8',
};

const EXTENDED_SIZES = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
};

const Stack: FC<Props> = ({
    children,
    extended,
    size,
    extendedSize,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                'relative grid gap-4 lg:gap-8',
                size && SIZES[size],
                extended &&
                    (extendedSize
                        ? EXTENDED_SIZES[extendedSize]
                        : 'grid-cols-2 md:grid-cols-6'),
                !extended &&
                    'no-scrollbar -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-scroll px-4 gradient-mask-r-90-d md:gradient-mask-none',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Stack;
