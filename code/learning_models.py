import theano.tensor as T
import numpy as np


def ALB_var(o, t, o2, v, alpha_0, beta_0, alpha_1, beta_1, d, tau_p,
                                     tau_n, unchosen_p, b, var_weight):

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    # Only update if outcome isn't missing
    alpha_0 = T.switch(T.ge(o, 0), (1 - d) * alpha_0 + (o * tau_p * unchosen_0), alpha_0)
    beta_0 = T.switch(T.ge(o, 0), (1 - d) * beta_0 + ((1 - o) * tau_n * unchosen_0), beta_0)

    alpha_1 = T.switch(T.ge(o2, 0), (1 - d) * alpha_1 + (o2 * tau_p * unchosen_1), alpha_1)
    beta_1 = T.switch(T.ge(o2, 0), (1 - d) * beta_1 + ((1 - o2) * tau_n * unchosen_1), beta_1)

    value_0 = alpha_0 / (alpha_0 + beta_0)
    value_1 = alpha_1 / (alpha_1 + beta_1)

    var_0 = (alpha_0 * beta_0) / (T.pow(alpha_0 + beta_0, 2) * (alpha_0 + beta_0 + 1))
    var_1 = (alpha_1 * beta_1) / (T.pow(alpha_1 + beta_1, 2) * (alpha_1 + beta_1 + 1))

    # Weighting by variance
    variance_bias = var_0 / (var_0 + var_1)

    w_value_0 = value_0 * (1 - (variance_bias * var_weight))
    w_value_1 = value_1 * (1 - (1 - variance_bias) * var_weight)

    value = ((w_value_0 - w_value_1) + 1) / 2.

    # Softmax
    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, alpha_0, beta_0, alpha_1, beta_1, o, o2, var_0, var_1, value_0, value_1, unchosen_0, unchosen_1, variance_bias, w_value_0, w_value_1)


def ALB_UCB(o, t, o2, v, alpha_0, beta_0, alpha_1, beta_1, d, tau_p,
            tau_n, unchosen_p, b, var_weight):

    b = 1. / b  # Convert inverse temperature to temperature

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    # Only update if outcome isn't missing
    alpha_0 = T.switch(T.ge(o, 0), (1 - d) * alpha_0 + (o * tau_p * unchosen_0), alpha_0)
    beta_0 = T.switch(T.ge(o, 0), (1 - d) * beta_0 + ((1 - o) * tau_n * unchosen_0), beta_0)

    alpha_1 = T.switch(T.ge(o2, 0), (1 - d) * alpha_1 + (o2 * tau_p * unchosen_1), alpha_1)
    beta_1 = T.switch(T.ge(o2, 0), (1 - d) * beta_1 + ((1 - o2) * tau_n * unchosen_1), beta_1)

    value_0 = alpha_0 / (alpha_0 + beta_0)
    value_1 = alpha_1 / (alpha_1 + beta_1)

    var_0 = (alpha_0 * beta_0) / (T.pow(alpha_0 + beta_0, 2) * (alpha_0 + beta_0 + 1))
    var_1 = (alpha_1 * beta_1) / (T.pow(alpha_1 + beta_1, 2) * (alpha_1 + beta_1 + 1))

    # UCB
    ucb_0 = value_0 + var_weight * T.sqrt(var_0)
    ucb_1 = value_1 + var_weight * T.sqrt(var_1)

    # Make sure values don't go outside 0-1
    ucb_0 = T.switch(T.ge(ucb_0, 1), 1, ucb_0)
    ucb_0 = T.switch(T.le(ucb_0, 0), 0, ucb_0)
    ucb_1 = T.switch(T.ge(ucb_1, 1), 1, ucb_1)
    ucb_1 = T.switch(T.le(ucb_1, 0), 0, ucb_1)

    # Decision
    value = ((ucb_0 - ucb_1) + 1) / 2.

    # Softmax
    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, alpha_0, beta_0, alpha_1, beta_1, var_0, var_1)


def ALB_softmax(o, t, o2, v, alpha_0, beta_0, alpha_1, beta_1, d, tau_p, tau_n, unchosen_p, b):

    # Without variance weighting
    b = 1. / b  # Convert inverse temperature to temperature

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    # Only update if outcome isn't missing
    alpha_0 = T.switch(T.ge(o, 0), (1 - d) * alpha_0 + (o * tau_p * unchosen_0), alpha_0)
    beta_0 = T.switch(T.ge(o, 0), (1 - d) * beta_0 + ((1 - o) * tau_n * unchosen_0), beta_0)

    alpha_1 = T.switch(T.ge(o2, 0), (1 - d) * alpha_1 + (o2 * tau_p * unchosen_1), alpha_1)
    beta_1 = T.switch(T.ge(o2, 0), (1 - d) * beta_1 + ((1 - o2) * tau_n * unchosen_1), beta_1)

    value_0 = alpha_0 / (alpha_0 + beta_0)
    value_1 = alpha_1 / (alpha_1 + beta_1)

    value = ((value_0 - value_1) + 1) / 2.

    var_0 = (alpha_0 * beta_0) / (T.pow(alpha_0 + beta_0, 2) * (alpha_0 + beta_0 + 1))
    var_1 = (alpha_1 * beta_1) / (T.pow(alpha_1 + beta_1, 2) * (alpha_1 + beta_1 + 1))

    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, alpha_0, beta_0, alpha_1, beta_1, var_0, var_1, value_0, value_1, o, o2, unchosen_0, unchosen_1)


def ALB_softmax_health_weighting(o, t, o2, health, v, alpha_0, beta_0, alpha_1, beta_1, d, tau_p, tau_n, unchosen_p, b,
                                 tau_p_w, tau_n_w, decay_w):

    # Without variance weighting
    b = 1. / b  # Convert inverse temperature to temperature

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    health = T.switch(T.lt(health, 0), 0, health)
    tau_p = T.switch(T.ge(tau_p, 0), tau_p * (1 - tau_p_w * health), tau_p * (1 - (1 + tau_p_w * health)))
    tau_n = T.switch(T.ge(tau_n, 0), tau_n * (1 - tau_n_w * health), tau_n * (1 - (1 + tau_n_w * health)))
    d = T.switch(T.ge(tau_p, 0), d * (1 - decay_w * health), d * (1 - (1 + decay_w * health)))

    # Only update if outcome isn't missing
    alpha_0 = T.switch(T.ge(o, 0), (1 - d) * alpha_0 + (o * tau_p * unchosen_0), alpha_0)
    beta_0 = T.switch(T.ge(o, 0), (1 - d) * beta_0 + ((1 - o) * tau_n * unchosen_0), beta_0)

    alpha_1 = T.switch(T.ge(o2, 0), (1 - d) * alpha_1 + (o2 * tau_p * unchosen_1), alpha_1)
    beta_1 = T.switch(T.ge(o2, 0), (1 - d) * beta_1 + ((1 - o2) * tau_n * unchosen_1), beta_1)

    value_0 = alpha_0 / (alpha_0 + beta_0)
    value_1 = alpha_1 / (alpha_1 + beta_1)

    value = ((value_0 - value_1) + 1) / 2.

    var_0 = (alpha_0 * beta_0) / (T.pow(alpha_0 + beta_0, 2) * (alpha_0 + beta_0 + 1))
    var_1 = (alpha_1 * beta_1) / (T.pow(alpha_1 + beta_1, 2) * (alpha_1 + beta_1 + 1))

    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, alpha_0, beta_0, alpha_1, beta_1, var_0, var_1, value_0, value_1, o, o2, unchosen_0, unchosen_1)


def ALB(o, t, o2, v, alpha_0, beta_0, alpha_1, beta_1, d, tau_p, tau_n, unchosen_p):
    # Without variance weighting or softmax

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    # Only update if outcome isn't missing
    alpha_0 = T.switch(T.ge(o, 0), (1 - d) * alpha_0 + (o * tau_p * unchosen_0), alpha_0)
    beta_0 = T.switch(T.ge(o, 0), (1 - d) * beta_0 + ((1 - o) * tau_n * unchosen_0), beta_0)

    alpha_1 = T.switch(T.ge(o2, 0), (1 - d) * alpha_1 + (o2 * tau_p * unchosen_1), alpha_1)
    beta_1 = T.switch(T.ge(o2, 0), (1 - d) * beta_1 + ((1 - o2) * tau_n * unchosen_1), beta_1)

    value_0 = alpha_0 / (alpha_0 + beta_0)
    value_1 = alpha_1 / (alpha_1 + beta_1)

    value = ((value_0 - value_1) + 1) / 2.

    var_0 = (alpha_0 * beta_0) / (T.pow(alpha_0 + beta_0, 2) * (alpha_0 + beta_0 + 1))
    var_1 = (alpha_1 * beta_1) / (T.pow(alpha_1 + beta_1, 2) * (alpha_1 + beta_1 + 1))

    return (value, alpha_0, beta_0, alpha_1, beta_1, var_0, var_1, value_0, value_1, o, o2, unchosen_0, unchosen_1)


def sticky_ALB(o, t, o2, v, alpha_0, beta_0, alpha_1, beta_1, d, tau_p, tau_n, unchosen_p, b, stickiness):
    b = 1. / b  # Convert inverse temperature to temperature

    # Implements choice stickiness
    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    # Only update if outcome isn't missing
    alpha_0 = T.switch(T.ge(o, 0), (1 - d) * alpha_0 + (o * tau_p * unchosen_0), alpha_0)
    beta_0 = T.switch(T.ge(o, 0), (1 - d) * beta_0 + ((1 - o) * tau_n * unchosen_0), beta_0)

    alpha_1 = T.switch(T.ge(o2, 0), (1 - d) * alpha_1 + (o2 * tau_p * unchosen_1), alpha_1)
    beta_1 = T.switch(T.ge(o2, 0), (1 - d) * beta_1 + ((1 - o2) * tau_n * unchosen_1), beta_1)

    value_0 = alpha_0 / (alpha_0 + beta_0)
    value_1 = alpha_1 / (alpha_1 + beta_1)

    value_0 = T.switch(T.le(v, 0.5), T.pow(value_0, stickiness), value_0)
    value_1 = T.switch(T.gt(v, 0.5), T.pow(value_1, stickiness), value_1)

    value = ((value_0 - value_1) + 1) / 2.

    var_0 = (alpha_0 * beta_0) / (T.pow(alpha_0 + beta_0, 2) * (alpha_0 + beta_0 + 1))
    var_1 = (alpha_1 * beta_1) / (T.pow(alpha_1 + beta_1, 2) * (alpha_1 + beta_1 + 1))

    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, alpha_0, beta_0, alpha_1, beta_1, var_0, var_1, value_0, value_1, o, o2)


def rescorla_wagner(o, t, o2, v, value_0, value_1, alpha, unchosen_p, b):

    b = 1. / b  # Convert inverse temperature to temperature

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    pe_0 = o - value_0
    pe_1 = o2 - value_1

    # Only update if outcome isn't missing
    value_0 = T.switch(T.ge(o, 0), value_0 + alpha * unchosen_0 * pe_0, value_0)
    value_1 = T.switch(T.ge(o2, 0), value_1 + alpha * unchosen_1 * pe_1, value_1)

    value = ((value_0 - value_1) + 1) / 2.

    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, value_0, value_1, pe_0, pe_1)


def dual_lr(o, t, o2, v, value_0, value_1, alpha_n, alpha_p, unchosen_p, b):

    b = 1. / b  # Convert inverse temperature to temperature

    unchosen_0 = T.switch(T.le(v, 0.5), 1, unchosen_p)
    unchosen_1 = T.switch(T.gt(v, 0.5), 1, unchosen_p)

    pe_0 = o - value_0
    pe_1 = o2 - value_1

    weighted_pe_0 = T.switch(T.lt(pe_0, 0), alpha_n * unchosen_0 * pe_0, alpha_p * unchosen_0 * pe_0)
    weighted_pe_1 = T.switch(T.lt(pe_1, 0), alpha_n * unchosen_1 * pe_1, alpha_p * unchosen_1 * pe_1)

    # Only update if outcome isn't missing
    value_0 = T.switch(T.ge(o, 0), value_0 + weighted_pe_0, value_0)
    value_1 = T.switch(T.ge(o2, 0), value_1 + weighted_pe_1, value_1)

    value = ((value_0 - value_1) + 1) / 2.

    value = np.exp(b * value) / (np.exp(b * value) + np.exp(b * (1 - value)))

    return (value, value_0, value_1, weighted_pe_0, weighted_pe_1)
