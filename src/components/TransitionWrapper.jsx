import { motion } from 'framer-motion';

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.98,
        position: 'absolute',
        width: '100%'
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        position: 'relative',
        width: '100%',
        zIndex: 1
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.98,
        position: 'absolute',
        width: '100%',
        zIndex: 0
    })
};

const TransitionWrapper = ({ children, custom }) => {
    return (
        <motion.div
            custom={custom}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.3 }
            }}
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default TransitionWrapper;
